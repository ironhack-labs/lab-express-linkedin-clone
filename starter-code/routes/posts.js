const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');

router.get('/:userId/posts/new', (req, res, next) => {
  const userInfo = { id: req.params.userId };
  res.render('posts/new', userInfo);
});

router.post('/:userId/posts', (req, res, next) => {
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.content,
    _creator: req.params.userId
  });

  newPost.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/profile/' + req.params.userId);
  });
});

module.exports = router;
