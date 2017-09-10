const router = require('express').Router()
const UserController = require('../controllers/UserController')
const isLoggedIn = require('../config/middlewares')

router.get('/profile/:id', UserController.profileGet)

router.get('/:id/edit', isLoggedIn('/'), UserController.editGet)
router.post('/:id/edit', isLoggedIn('/'), UserController.editPost)

router.get('/:id/post', isLoggedIn('/'), UserController.postGet)
router.post('/:id/post', isLoggedIn('/'), UserController.postPost)
router.get('/post/:postId', isLoggedIn('/'), UserController.postEditGet)
router.post('/post/:postId', isLoggedIn('/'), UserController.postEditPost)

module.exports = router