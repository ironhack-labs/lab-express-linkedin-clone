const express = require("express");
const profileController = express.Router();
const User = require("../models/user");

profileController.get("/:id", (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }, "").exec((err, user) => {
    if (!user) {
      return next(err);
    };

    //Unfollow button
if (req.session.currentUser) {
    var isFollowing = req.session.currentUser.following.indexOf(user._id.toString()) > -1;
  }
  res.render("profiles/show", {
    user: user,
    session: req.session.currentUser,
    button_text: isFollowing ? "Unfollow" : "Follow"
  });
 });
});


profileController.post("/:id", (req, res, next) => {
  const id = req.params.id;
  const updates = {
    imageUrl: req.body.imageUrl,
    username: req.body.username,
    email: req.body.email,
    jobTitle: req.body.jobTitle,
    company: req.body.company,
    summary: req.body.summary,
  };

  User.findByIdAndUpdate(id, updates, (err, profile) => {
    if (err) {
      return next(err);
    }
    res.redirect("/profile/" + id);
  });
});

profileController.get("/:id/edit", (req, res, next) => {
  const session = req.session.currentUser;
  if(session) {
    res.render("profiles/edit", {
      session: session,
    });
  } else {
    res.redirect("/");
  }
});

// Follow and unfollow
profileController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

profileController.post("/:id/follow", (req, res) => {
  User.findOne({ _id: req.params.id }, "").exec((err, follow) => {
    if (err) {
      res.redirect("/profile/" + req.params.id);
      return;
    }

    User.findOne({ _id : req.session.currentUser._id }).exec((err, currentUser) => {
        const followingIndex = currentUser.following.indexOf(follow._id);

        if (followingIndex > -1) {
          currentUser.following.splice(followingIndex, 1);
        } else {
          currentUser.following.push(follow._id);
        }

        currentUser.save((err) => {
          req.session.currentUser = currentUser;
          res.redirect("/profile/" + req.params.id);
        });
      });
  });
});

module.exports = profileController;
