const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


/* GET users listing. */
router.get('/', authController.index);
router.get('/signup', authController.signup);
router.get('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/signup', authController.doSignup);
router.post('/login', authController.doLogin);

module.exports = router;