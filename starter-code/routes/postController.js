const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");

const postController = express.Router();

// CREATE A NEW POST
postController.get("/new", (req, res, next) => {
  res.render("posts/new",
    { username: req.session.currentUser.username });
});

// SAVE NEW POST
postController.post("/", (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ username: user.username }).exec((err, user) => {
    if (err) { return; }

    const post = new Post({
      content: req.body.content,
      creator: user._id
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


module.exports = postController;
