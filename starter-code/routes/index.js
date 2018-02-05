const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    User.find({}, (err, users) => {
      if (err) {
        return next(err);
      }
      const info = {
        curUser: req.session.currentUser,
        users
      };
      res.render('index', info);
    });
  } else {
    res.render('auth/login');
  }
});

module.exports = router;
