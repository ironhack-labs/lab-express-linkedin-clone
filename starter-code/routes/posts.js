const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const router  = express.Router();

router.get('/:id/new', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) { next(err); }
    console.log(user);
    res.render('posts/newPost', { user: user });
  });
});


router.post('/:id/new', (req, res, next) => {
  let userId = req.params.id;

  User.findById(userId, (err, user) => {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content
    });

    user.posts.push(newPost);

    user.save((err) => {
      res.redirect(`/`);
    });
  });
});

router.get('/:id/show', (req, res, next) => {

  User.findById(req.params.id, (err, user) => {
    if (err) { next(err); }
    console.log(user);
    res.render('posts/userPosts', { user: user, title: "Mis posts" });
  });
});

module.exports = router;
