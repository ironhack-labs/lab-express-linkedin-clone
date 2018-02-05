const express = require('express');
const authController = express.Router();

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// signup functionality

authController.get('/signup', (req, res, next) => {
  res.render('authentication/signup');
});

authController.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;

  if (username === '' || password === '' || email === '' || name === '') {
    res.render('authentication/signup', {
      errorMessage: 'Indicate a username, name, email and a password to sign up'
    });
    return;
  }

  User.findOne({ 'username': username }, 'username', (err, user) => {
    if (err) {
      return;
    }

    if (user !== null) {
      res.render('authentication/signup', {
        errorMessage: 'The username already exists'
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass,
      name: name,
      email: email
    });

    newUser.save((err) => {
      if (err) {
        res.render('authentication/signup', {
          errorMessage: 'Something went wrong when signing up'
        });
      } else {
        // User has been created
        res.redirect('/login');
      }
    });
  });
});

// login functionality
authController.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
  } else {
    res.render('authentication/login');
  }
});

authController.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    res.render('authentication/login', {
      errorMessage: 'Indicate a username and a password to log in'
    });
    return;
  }

  User.findOne({ 'username': username }, '_id username password following', (err, user) => {
    if (err) {
      res.render('authentication/login', {
        errorMessage: 'An verification error occured'
      });
      return;
    }
    if (!user) {
      res.render('authentication/login', { errorMessage: "The username doesn't exist" });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        // logged in
        res.redirect('/');
      } else {
        res.render('authentication/login', {
          errorMessage: 'Incorrect password'
        });
      }
    }
  });
});

// define logout
authController.get('/logout', (req, res, next) => {
  // if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = authController;
