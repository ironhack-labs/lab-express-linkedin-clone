const express = require('express');
const authController = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authController.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authController.post('/signup', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let summary = req.body.summary;
  let imageURL = req.body.imageURL;
  let company = req.body.company;
  let jobtittle = req.body.jobtittle;

  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ 'username': username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass,
      email,
      summary,
      imageURL,
      company,
      jobtittle
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect('/login');
      }
    });
  });
});


authController.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authController.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        errorMessage: "The name doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.render('./home', {
        user: user
      });
    }
    else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password'
      });
    }
  });
});

authController.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

module.exports = authController;