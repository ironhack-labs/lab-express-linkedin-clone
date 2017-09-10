const router = require("express").Router()
const authController = require('../controllers/auth')

router.get("/signup", authController.signupGet)
router.post('/signup', authController.signupPost)

router.get('/login', authController.loginGet)
router.post('/login', authController.loginPost)

router.get('/logout', authController.logout)

module.exports = router
