const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('../models/user')

//  新增使用者
router.post('/', async (req, res, next) => {
  try {
    const { email, name, password, confirmPassword } = req.body

    if (!email || !password) {
      req.flash('error', 'email 及 password 為必填')
      return res.redirect('back')
    }

    if (password !== confirmPassword) {
      req.flash('error', '驗證密碼與密碼不符')
      return res.redirect('back')
    }

    const rowCount = await User.count({ email })

    if (rowCount > 0) {
      req.flash('error', 'email 已註冊')
      return res.redirect('back')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, name, password: hashedPassword })

    if (!user) {
      return res.redirect('back')
    }

    req.flash('success', '註冊成功')
    return res.redirect('/login')
  } catch (error) {
    error.errorMessage = '註冊失敗'
    next(error)
  }
})

module.exports = router;