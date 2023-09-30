const express = require('express')
const router = express.Router()
const passport = require('passport')

//  登入頁面
router.get('/login', (req, res) => {
  return res.render('login')
})

//  註冊頁面
router.get('/register', (req, res) => {
  return res.render('register')
})

// 登錄處理
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//  登出處理
router.post('/logout', (req, res) => {
  req.logout((error) => {
    if (error) {
      next(error)
    }
    req.flash('success', '登出成功!');

    return res.redirect('/login')
  })
})

module.exports = router