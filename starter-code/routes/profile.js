const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const User = require('../models/User');

const router  = express.Router();

router.get('/home', isLoggedIn, (req, res) => {
  res.render('home');
});

router.post('/profile/:id', (req, res, next) => {
  const userId = req.params.id;
  const updates = {
     username : req.body.username,
     email : req.body.email,
     password : req.body.password,
     summary : req.body.summary,
     imageURL : req.body.imageURL,
     company : req.body.company,
     jobTitle : req.body.jobTitle
  };

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    res.render('home', { user: user });
  });
});

router.get('/profile/show/:id', (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('profile/show', { user: user });
  });
});

router.get('/profile/:id/edit', (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('profile/edit', { user: user });
  });
});

module.exports = router;
