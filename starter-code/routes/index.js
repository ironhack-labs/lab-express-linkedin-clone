const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');

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
      Post.find({}, (err, posts) => {
        if (err) {
          return next(err);
        }
        const info = {
          curUser: req.session.currentUser,
          userList,
          postsList: posts
        };
        res.render('index', info);
      });
    });
  } else {
    res.render('auth/login');
  }
});

module.exports = router;
