const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.currentUser;
  if (user) {
    Post.find({"_creator": user._id}, (err, docs) => {
      res.render('home', {user, docs});
    });
  } else {
    res.redirect('users/login');
  }
});

module.exports = router;
