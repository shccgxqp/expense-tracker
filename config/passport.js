const passport = require('passport')
const localStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
require('dotenv').config()

const bcrypt = require('bcryptjs')

const User = require('../models/user')

// 本土認證
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

// facebook認證
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value
  const name = profile.displayName
  return User.findOne({ email })
    .then((user) => {
      if (user) return done(null, user)
      const randomPwd = Math.random().toString(36).slice(-8)

      return bcrypt.hash(randomPwd, 10)
        .then((hash) => User.create({ name, email, password: hash }))
        .then((user) => done(null, { id: user.id, name: user.name, email: user.email }))
    })
    .catch((error) => {
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