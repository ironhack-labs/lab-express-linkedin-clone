const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();

const bcryptSalt = 10;
const User = require('../models/user');



/* GET Index page. */
router.get('/', (req, res, next) => {
  res.render('home');
});

/* GET signup page. */
router.get('/signup', (req, res, next) => {
  res.render('authentication/signup');
});

/* POST save the user information in the database */
router.post('/signup', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const summary = req.body.summary;
  const imageUrl = req.body.imageUrl;
  const company = req.body.company;
  const jobTitle = req.body.jobTitle;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashPass,
    summary,
    imageUrl,
    company,
    jobTitle,
  });

  if (email === '' || password === '') {
    res.render('authentication/signup', {
      errorMessage: 'Please indicate an email and a password to sign up',
    });
    return;
  }

  newUser.save((err) => {
    if (err) {
      return res.render('authentication/signup', { errors: newUser.errors });
    }
    return res.redirect('user');
  });
});

/* GET login page. */
router.get('/login', (req, res, next) => {
  res.render('authentication/login', { title: 'Express' });
});

/* POST check the user information in the database */
router.post('/login', (req, res, next) => {
  res.render('user', { title: 'Express' });
});

/* GET logout user and render Index page. */
router.get('/logout', (req, res, next) => {
  res.render('/', { title: 'Express' });
});

module.exports = router;
