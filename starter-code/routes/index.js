const router = require('express').Router()
const auth = require('./auth')
const indexController = require('../controllers/index')

router.use('/', auth);
router.get('/', indexController.homeGet)

module.exports = router
