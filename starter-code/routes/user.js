const router = require('express').Router()
const UserController = require('../controllers/UserController')
const isLoggedIn = require('../middlewares/isLoggedIn')

router.get('/profile', isLoggedIn('/'), UserController.profileGet)

module.exports = router