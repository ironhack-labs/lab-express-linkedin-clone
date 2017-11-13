const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");

const post = express.Router();

// CREATE A NEW POST
post.get("/new", (req, res, next) => {
  res.render("posts/new",
    { name: req.session.currentUser.name });
});

// SAVE NEW POST
post.post("/", (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ name: user.name }).exec((err, user) => {
    if (err) { return; }

    const post = new Post({
      content: req.body.content,
      creator: user._id,
      creatorName: user.name
    });

    post.save((err) => {
      if (err) {
        res.redirect("/home");
      } else {
        res.redirect("/home");
      }
    });
  });
});


module.exports = post;
