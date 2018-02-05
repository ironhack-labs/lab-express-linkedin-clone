const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Main homepage
router.get('/', (req, res) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
  } else {
    res.render('home', {user: req.session.currentUser});
  }
});

module.exports = router;
