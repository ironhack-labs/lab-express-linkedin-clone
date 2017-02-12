'use strict';
/* jshint esversion: 6, node: true */

const express       = require('express');
const router        = express.Router();
const bcrypt        = require('bcrypt');
const User          = require('../models/User');

// routes
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;
  if (user){
    res.render('home', {
      user
    });
    return;
  }
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  const user = req.session.currentUser;
  if (user){
    res.render('home', {
      user
    });
    return;
  }
  res.render('authentication/login');
});

router.post('/login', (req, res, next) => {
  const {userName, password, name, email} = req.body;
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  
});

router.post('/logout', (req, res, next) => {

});

module.exports = router;
