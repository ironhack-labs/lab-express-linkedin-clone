'use strict';
const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/users');

const bcryptSalt = 10;

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/');
});

/* GET log in. */
router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/login');
});

/* POST log in. */
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  // validate (not empty fields + password conditions)
  // if (username === '' || password === '' || password.length < 8 || !password.match(/[A-Z]/)) {
  //   const data = {
  //     message: 'Try again'
  //   };
  //   return res.render('auth/signup', data);
  // }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    // validation
    if (!user) {
      const data = {
        message: 'Username or password are incorrect'
      };
      return res.render('auth/login', data);
    }
    // compara les contrasenyes !! es aqui on entra !!
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      const data = {
        message: 'Username or password are incorrect'
      };
      res.render('auth/login', data);
    }
  });
});

/* GET sign up. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  res.render('auth/signup');
});

/* POST sign up. */
router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  // falta validation - UI UX

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    // va bé tenir un altre if per estructurar millor
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }
    // un cop passa la validació encriptem la password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    // creem un nou user a la base de dades amb la info del post
    const newUser = new User({
      username,
      password: hashPass,
      name,
      email
    });
    // el salvem a la base de dades i redirigim directament a la home
    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = newUser;
      res.redirect('/');
    });
  });
});

/* POST log out. */
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
