
const express = require('express');
// const User = require('../models/user');
const router = express.Router();

/* render the login form. */
router.get('/login', (req, res, next) => {
  // if (req.session.currentUser) {
  //   return res.redirect('/');
  // }
  const data = {
    title: 'Login'
  };
  res.render('authentication/login', data);
});

module.exports = router;
