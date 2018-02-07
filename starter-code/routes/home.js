const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

authRoutes.get("/", function(req, res, next) {
  Post.find().exec((err, posts) => {
    res.render("index", {
      posts: posts,
      title: "Home"
    });
  });
});

module.exports = authRoutes;
