const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Main homepage
router.get('/profile/:userId/edit', (req, res, next) => {
  let userId = req.params.userId;

  User.findOne({_id: userId}, function (err, user) {
    if (err) {
      return next(err);
    }
    if (req.session.currentUser._id !== userId) {
      res.redirect('/');
    } else {
      res.render('profiles/edit', {user: user});
    }
  });
});

module.exports = router;
