const express = require('express')
const router = express.Router();

const root = require('./root')
const trackers = require('./trackers')
const oauth = require('./oauth')
const users = require('./users')

const authHandler = require('../middlewares/auth-handler')

router.use('/', root)
router.use('/oauth', oauth)
router.use('/users', users)
router.use('/', authHandler, trackers)


module.exports = router;