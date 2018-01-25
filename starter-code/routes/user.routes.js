const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const secure = require('../configs/passport.config');

router.get('/profile/:userId/edit', secure.isAuthenticated, userController.editProfile);
router.get('/profile/:userId', secure.isAuthenticated, userController.profile);

router.post('/profile/:userId', secure.isAuthenticated, userController.doEditProfile);

// router.get('/users', secure.checkRole("ADMIN"), userController.list);

module.exports = router;