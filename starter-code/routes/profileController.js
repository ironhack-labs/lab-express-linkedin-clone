const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/user");
const Post = require("../models/post");

// Moment to format dates
const moment = require("moment");

profileController.get("/:username", (req, res, next) => {
  User
    .findOne({ username: req.params.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return next(err); }



      // ADDS UNFOLLOW BUTTON
      if (req.session.currentUser) {
        isFollowing = req.session.currentUser.following.indexOf(user._id.toString()) > -1;
      }

      Post.find({ "user_name": user.username }, "post created_at")
        .sort({ created_at: -1 })
        .exec((err, post) => {
          res.render("profile/show", {
            username: user.username,
            post,
            moment,
            session: req.session.currentUser,
            button_text: isFollowing ? "Unfollow" : "Follow"
        });
      });
  });
});

// FOLLOW & UNFOLLOW.
profileController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

profileController.post("/:username/follow", (req, res) => {
  User.findOne({ "username": req.params.username }, "_id").exec((err, follow) => {
    if (err) {
      res.redirect("/profile/" + req.params.username);
      return;
    }

    User
      .findOne({ "username": req.session.currentUser.username })
      .exec((err, currentUser) => {
        var followingIndex = currentUser.following.indexOf(follow._id);

        if (followingIndex > -1) {
          currentUser.following.splice(followingIndex, 1)
        } else {
          currentUser.following.push(follow._id);
        }

        currentUser.save((err) => {
          req.session.currentUser = currentUser;
          res.redirect("/profile/" + req.params.username);
        });
      });
  });
});

// TIMELINE
profileController.get("/:username/timeline", (req, res) => {
  const currentUser = req.session.currentUser;
  // Includes yourself in the timeline.
  currentUser.following.push(currentUser._id);

  Post.find({ user_id: { $in: currentUser.following } })
    .sort({ created_at: -1 })
    .exec((err, timeline) => {
      res.render("profile/timeline", {
        username: currentUser.username,
        timeline,
        moment
      });
  });
});

module.exports = profileController;
