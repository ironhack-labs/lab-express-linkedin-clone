const express = require('express');
const router = express.Router();
const secure = require('../configs/secure.config');
const profileController = require('../controllers/profile.controller');

router.get('/:userId', profileController.show);
router.get('/:email/edit', secure.isAuthenticated, profileController.edit);
router.post('/update', secure.isAuthenticated, profileController.update);

module.exports = router;  