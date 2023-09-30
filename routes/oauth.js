const express = require('express')
const router = express.Router()
const passport = require('passport')

// Facebook
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

// Facebook註冊
router.get('/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router