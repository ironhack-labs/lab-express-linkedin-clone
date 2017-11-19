const express = require('express');
const postController = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

//Middleware to protect path
postController.use((req, res, next) => {
  if (req.session.currentUser) { 
    next(); 
  }
  else { 
    res.redirect('/login'); 
  }
});

postController.get('/:id/posts/new', (req, res, next) => {
  res.render('posts/new',
    { user: req.session.currentUser });
});

postController.post('/:id/posts', (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ _id: user._id }).exec((err, user) => {
    if (err) { return; }
    const newPost = new Post({
      content:   req.body.content,
      _creator: user._id,
    });

    newPost.save((err) => {
      if (err) {
        res.render('posts/new',
          {
            user : user,
            errorMessage: "Couldn't save the data!" + err,
          });
      } else {
        res.redirect('/');
      }
    });
  });
});

module.exports = postController;