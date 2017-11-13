const express = require('express');
const homeController = express.Router();

const Post = require('../models/Post');

homeController.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/login")
});

homeController.get('/', function(req, res) {
  let user = req.session.currentUser;

  Post.find().sort({ created_at: -1 }).exec((err, posts) => {
    res.render('home', { user:  user, posts: posts });
  });
});

module.exports = homeController;
