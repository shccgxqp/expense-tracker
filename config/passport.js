const passport = require('passport')
const localStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
require('dotenv').config()

const bcrypt = require('bcryptjs')

const User = require('../models/user')

passport.use(new localStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({ email: username })
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }
      return bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return done(null, false, { message: 'email 或密碼錯誤' })
        }
        return done(null, user)
      })
    }).catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})


module.exports = passport