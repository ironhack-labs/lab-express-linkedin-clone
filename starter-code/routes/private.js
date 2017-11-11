const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

// GET home page.
// If you're logged in, you get into the homepage, if you don't, you're redirected to the log in page.
router.get('/home', isLoggedIn, (req, res) => {
  res.render('home');
});

module.exports = router;
