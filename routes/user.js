const express = require('express');

const router = express.Router();

// The required user Controller
const user = require('../controllers/userController.js');

// All routes to CRUD functions like below

// Get all user profiles
router.get('/', user.list);

// Get single user profile by id
router.get('/:id', user.show);

/*// Create user profile
router.get('/create', user.create);

// Save user profile
router.post('/save', user.save);*/

// Edit user profile
router.get('/:id/edit', user.edit);

// Update user profile
router.post('/:id/update', user.update);

// Delete user profile
router.post('/:id/delete/', user.delete);

module.exports = router;
