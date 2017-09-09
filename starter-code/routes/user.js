const router = require('express').Router()
const UserController = require('../controllers/UserController')
const isLoggedIn = require('../config/middlewares')

router.get('/profile', isLoggedIn('/'), UserController.profileGet)

module.exports = router