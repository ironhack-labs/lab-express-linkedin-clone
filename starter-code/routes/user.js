const router = require('express').Router()
const UserController = require('../controllers/UserController')
const isLoggedIn = require('../config/middlewares')

router.get('/profile/:id', UserController.profileGet)

router.get('/:id/edit', isLoggedIn('/'), UserController.editGet)
router.post('/:id/edit', isLoggedIn('/'), UserController.editPost)

module.exports = router