const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    User.find({}, (err, users) => {
      if (err) {
        return next(err);
      }
      let userList = [];
      for (let i = 0; i < users.length; i++) {
        if (!users[i]._id.equals(req.session.currentUser._id)) {
          userList.push(users[i]);
        }
      }
      const info = {
        curUser: req.session.currentUser,
        userList
      };
      res.render('index', info);
    });
  } else {
    res.render('auth/login');
  }
});

module.exports = router;
