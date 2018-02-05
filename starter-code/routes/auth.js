'use stric';

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

const router = express.Router();

const bcryptSalt = 10;

// signup page

router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  res.render('authentication/signup');
});

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  // validate
  if (username === '' || password === '' || password.length < 8 || !password.match(/[A-Z]/)) {
    const data = {
      title: 'Signup',
      message: 'Try again'
    };
    return res.render('authentication/signup', data);
  }

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('authentication/signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = newUser;
      res.redirect('/');
      console.log('worked?');
    });
  });
});

// login page

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  res.render('authentication/login');
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    const data = {
      title: 'Login',
      message: 'Indicate a username and a password to sign up'
    };
    return res.render('authentication/login', data);
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      return res.render('authentication/login', data);
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/auth');
    } else {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      res.render('authentication/login', data);
    }
  });
});

// user logged in

router.get('/', (req, res, next) => {
  res.render('authentication/home');
});

router.get('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/auth/login');
});

module.exports = router;
