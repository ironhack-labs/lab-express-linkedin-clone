const router = require('express').Router()
const UserController = require('../controllers/UserController')
const isLoggedIn = require('../config/middlewares')

router.get('/profile', isLoggedIn('/'), UserController.profileGet)

router.get('/:id/edit', isLoggedIn('/'), UserController.editGet)
//router.post('/:id/edituser', isLoggedIn('/'), UserController.editPost)

module.exports = router