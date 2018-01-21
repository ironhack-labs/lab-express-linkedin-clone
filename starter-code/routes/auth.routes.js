const express = require('express');
const router = express.Router();
const secure = require('../configs/secure.config');
const authController = require('../controllers/auth.controller');

router.get('/signup', authController.signup);
router.post('/signup', authController.doSignup);
router.get('/signok', secure.isAuthenticated, authController.signok);

router.get('/login', authController.login);
router.post('/login', authController.doLogin);

router.get('/logout', authController.logout);

module.exports = router;