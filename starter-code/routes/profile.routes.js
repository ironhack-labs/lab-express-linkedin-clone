const express = require('express');
const router = express.Router();
const secure = require('../configs/secure.config');
const profileController = require('../controllers/profile.controller');

router.get('/:userId/edit', secure.isAuthenticated, profileController.edit);
// router.post('/:username/follow', profileController.follow);

module.exports = router;