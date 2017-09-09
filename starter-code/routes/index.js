const router = require('express').Router()
const IndexController = require('../controllers/IndexController')
const auth = require('./auth')
const user = require('./user')

router.get('/', IndexController.index)

router.use('/auth', auth)
router.use('/user', user)

module.exports = router