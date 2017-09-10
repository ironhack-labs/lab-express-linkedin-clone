const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.get('/signup', AuthController.signupGet)
router.post('/signup', AuthController.signupPost)

router.get('/login', AuthController.loginGet)
router.post('/login', AuthController.loginPost)
 
router.get('/logout', AuthController.logout)

module.exports = router