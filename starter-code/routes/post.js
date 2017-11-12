const express          = require("express");
const postController = express.Router();
// const moment = require("moment");

const User  = require("../models/user");
const Post = require("../models/post");

// MIDDLEWARE TO PROTECT PATH.
postController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

postController.get("/new", (req, res, next) => {
  res.render("post/new",
    { username: req.session.currentUser.username });
});

postController.post("/", (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ username: user.username }).exec((err, user) => {
    if (err) { return; }

    const newPost = new Post({
      user_id:   user._id,
      user_name: user.username,
      post: req.body.post
    });

    newPost.save((err) => {
      if (err) {
        res.render("post/new",
          {
            username: user.username,
            errorMessage: err.errors.tweet.message
          });
      } else {
        res.redirect("/post");
      }
    });
  });
});

// SHOW POSTS.
postController.get("/", (req, res, next) => {
  User
    .findOne({ username: req.session.currentUser.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return; }

      Post.find({ "user_name": user.username }, "tweet created_at")
        .sort({ created_at: -1 })
        .exec((err, post) => {
          console.log(post);
          res.render("post/index",
            {
              username: user.username,
              post,
              moment });
        });
  });
});

module.exports = postController;
