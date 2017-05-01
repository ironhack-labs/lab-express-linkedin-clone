/*jshint esversion: 6*/
const express           = require("express");
const postsController   = express.Router();
const User              = require("../models/user");
const Post              = require("../models/post");
const moment            = require("moment");


postsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

postsController.get("/users/:userId/posts", (req, res, next) => {
  console.log("hi");
  User
    .findOne({ _id: req.params.userId }, "_id email name")
    .exec((err, user) => {
      if (!user) { return; }
      // console.log("user.email",user.email);
      Post.find({ "user_email": user.email }, "post created_at")
        .sort({ created_at: -1 })
        .exec((err, posts) => {
          // console.log("posts",posts);
          res.render("posts/index",
            {
              user,
              currentUser : req.session.currentUser,
              posts,
              moment,
             });
        });
  });
});

postsController.get("/users/:userId/posts/new", (req, res, next) => {
  if(req.session.currentUser._id != req.params.userId)
  {
    return res.redirect('/');
  }
  else
  {
    res.render("posts/new",
      { user: req.session.currentUser });
  }

});

postsController.post("/users/:userId/posts", (req, res, next) => {

  if(req.session.currentUser._id != req.params.userId)
  {
    return res.redirect('/');
  }
  else
  {
    const user  = req.session.currentUser;

    User.findOne({ email: user.email }).exec((err, user) => {
      if (err) { return; }

      const newPost = Post({
        user_id:   user._id,
        user_email: user.email,
        user_name: user.name,
        post:     req.body.postText
      });

      newPost.save((err) => {
        if (err) {
          res.render("posts/new",
            {
              user: user,
              errorMessage: err.errors.post.message
            });
        } else {
          res.redirect("/");
        }
      });
    });
  }
});

module.exports = postsController;
