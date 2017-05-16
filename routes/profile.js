const express = require('express');

const authController = require('../controllers/authController.js');

const router = express.Router();

// The required user Controller
const user = require('../controllers/userController.js');

// All routes to CRUD functions like below

// Get all user profiles
router.get('/', user.list);

// Get single user profile by id
router.get('/:id', user.show);

// Edit user profile
router.get('/:id/edit', authController.checkProfileOwnership, user.edit);

// Update user profile
router.post('/:id/update', authController.checkProfileOwnership, user.update);

// Delete user profile
router.post('/:id/delete/', authController.checkProfileOwnership, user.delete);

module.exports = router;
