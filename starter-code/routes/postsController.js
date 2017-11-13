const express = require('express');
const postsController = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

postsController.get('/new', (req, res) => {
  res.render('posts/new', { user: req.session.currentUser });
});

postsController.post('/', (req, res) => {
  let user = req.session.currentUser;
  let content = req.body.content;

  let newPost = new Post({
    content: content,
    _creator: user,
    username: user.username
  });

  newPost.save((err) => {
    if (err) {
      res.render('posts/new', { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

module.exports = postsController;
