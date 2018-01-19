const express = require('express');
const router = express.Router();
const secure = require('../configs/secure.config');
const userController = require('../controllers/user.controller');

router.get('/:userId/posts/new', secure.isAuthenticated, userController.new);

module.exports = router; 