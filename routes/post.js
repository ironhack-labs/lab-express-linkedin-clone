const express = require('express');

const User = require('../models/user.js');
const Post = require('../models/post.js');

const authController = require('../controllers/authController');

const postRoutes = express.Router();

/* GET the user's Blog Post page. */
postRoutes.get('/:id/posts/new', (req, res, next) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    res.render('posts/new', { user });
  });
});

postRoutes.post('/:id/posts/', authController.checkProfileOwnership, (req, res, next) => {
  const _creator = req.params.id;
  const content = req.body.content;
  const nameOfUser = req.session.currentUser.name;

  const newPost = new Post({
    _creator,
    content,
    nameOfUser,
  });
  newPost.save((err) => {
    if (err) {
      console.log('Error: ', err);
    }
    res.redirect('/');
  });
});

module.exports = postRoutes;
