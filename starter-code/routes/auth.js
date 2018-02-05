
const express = require('express');
// const User = require('../models/user');
const router = express.Router();

/* render the login form. */
router.get('/login', (req, res, next) => {
  const data = {
    title: 'Login'
  };
  res.render('authentication/login', data);
});

router.get('/signup', (req, res, next) => {
  const data = {
    title: 'Signup'
  };
  res.render('authentication/signup', data);
});

router.get('/logout', (req, res, next) => {
  res.redirect('authentication/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const data = {
    title: 'Welcome'
  };
  res.render('/', data);
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const data = {
    title: 'Welcome'
  };
  res.render('/', data);
});

module.exports = router;
