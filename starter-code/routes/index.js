const express = require('express');
const router = express.Router();
const User = require('../models/User');

function authCheck(req, res, next) {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', authCheck, (req, res, next) => {
  const data = req.session.currentUser;
  res.render('index', { data });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

router.get('/allprofiles', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err) }
    res.render('profiles/profilelist', { users });
  });
});

router.get('/profile/:userId', (req, res, next) => {

  User.findById(req.params.userId, (err, data) => {
    if (err) {
      return next(err);
    };

    if(!req.session.currentUser || req.params.userId !== req.session.currentUser._id) {
      console.log(data);
      res.render('profiles/profile-public',  { data });
      return;
    }

    res.render('profiles/profile-private', { data });

  });
});

router.get('/profile/:userId/edit', (req, res, next) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      return next(err);
    };
    res.render('profiles/profile-private', { data });
  });
});

router.post('/profile/:userId', authCheck, (req, res, next) => {

  //The user should be redirected to the homepage if they're trying to edit a profile that isn't theirs.
  if(req.params.userId !== req.session.currentUser._id) {
    res.redirect('/');
    return;
  }

  const profileInfo = {
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.picture,
    company: req.body.company,
    jobTitle: req.body.jobtitle
  }

  User.update({ _id: req.params.userId}, profileInfo, (err) => {
    if (err) {
      next(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
