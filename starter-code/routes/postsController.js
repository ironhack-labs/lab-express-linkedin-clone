const express          = require("express");
const postsController = express.Router();
const User  = require("../models/user");
const Post = require("../models/post");

//MIDDLEWARE TO PROTECT PATH.
postsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

postsController.get("/:id/posts/new", (req, res, next) => {
  res.render("posts/new",
    { user: req.session.currentUser });
});

postsController.post("/:id/posts", (req, res, next) => {
  const user  = req.session.currentUser;

  User.findOne({ _id: user._id }).exec((err, user) => {
    if (err) { return; }
    const newPost = new Post({
      content:   req.body.content,
      _creator: user._id,
    });

    newPost.save((err) => {
      if (err) {
        res.render("posts/new",
          {
            user : user,
            errorMessage: "Couldn't save the data!" + err,
          });
      } else {
        res.redirect("/profile/" + user._id);
      }
    });
  });
});

module.exports = postsController;
