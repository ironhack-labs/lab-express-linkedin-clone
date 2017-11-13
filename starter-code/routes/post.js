const Post = require('../models/Post');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/:userId/posts', function(req, res, next) {
  if (req.session.currentUser) {
    Post.findById(req.params.userId, (err, user) => {
      if (err) { 
        return next(err);
      };
      res.render('posts/new', {
        id: req.params.userId
      });
    });
  } else {
    res.redirect('/login'); // COMPLETE
  }
});

router.post('/:userId/posts', function(req, res, next) {
  if (req.session.currentUser) {
    const content = req.body.content;
    if (content === "") {
      res.render("posts/new", {
        errorMessage: "Please, fill all fields"
      });
      return;
    }
    // if all is filled, search in bbdd
    var newPost = Post({
      content,
      _creator: mongoose.Types.ObjectId(req.params.userId)
    });
    newPost.save((err) => {
      res.redirect("/");
    });
  }
});

module.exports = router;
