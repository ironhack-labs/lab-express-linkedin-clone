const express = require('express');
const profileController = express.Router();
const User = require('../models/user');

profileController.get('/:id', (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }, '').exec((err, user) => {
    if (!user) {
      return next(err);
    }
    res.render('profile/show', {
      user: user,
      session: req.session.currentUser,
    });
  });
});

profileController.post('/:id', (req, res, next) => {
  const userId = req.params.id;
  const updates = {
    name: req.body.name,
    email: req.body.email,
    imageUrl: req.body.imageUrl,
    jobTitle: req.body.jobTitle,
    company: req.body.company,
    summary: req.body.summary,
  };

  User.findByIdAndUpdate(userId, updates, (err, profile) => {
    if (err) {
      return next(err)
    }
    res.render('home', { user: user });
  });
});

profileController.get('/:id/edit', (req, res, next) => {
  const session = req.session.currentUser;
  res.render('profile/edit', { session: session });
});

module.exports = profileController;