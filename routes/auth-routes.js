const express = require('express');
const bcrypt = require('bcrypt');

const authRoutes = express.Router();

const bcryptSalt = 10;
const User = require('../models/user');

/* GET Index page. */
authRoutes.get('/', (req, res, next) => {
  res.render('home');
});

/* GET signup page. */
authRoutes.get('/signup', (req, res, next) => {
  res.render('authentication/signup');
});

/* POST save the user information in the database */
authRoutes.post('/signup', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const summary = req.body.summary;
  const imageUrl = req.body.imageUrl;
  const company = req.body.company;
  const jobTitle = req.body.jobTitle;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ email }, 'email', (err, user) => {
    if (user !== null) {
      res.render('authentication/signup', { errorMessage: 'This email is already registered. Want to' });
      return;
    }
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
        res.render('authentication/signup', { errors: newUser.errors });
      }
      req.session.currentUser = newUser;
      res.redirect('profile');
    });
  });
});

/* GET login page. */
authRoutes.get('/login', (req, res, next) => {
  res.render('authentication/login');
});

/* POST check the user information in the database */
authRoutes.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    res.render('authentication/login', {
      errorMessage: 'Indicate an email and a password to login',
    });
    return;
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      res.render('authentication/login', {
        errorMessage: "The username doesn't exist",
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('profile');
    } else {
      res.render('authentication/login', {
        errorMessage: 'Incorrect password',
      });
    }
  });
});

/* GET logout user and render Login page. */
authRoutes.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect('login');
  });
});

module.exports = authRoutes;
