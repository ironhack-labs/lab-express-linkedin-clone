const express = require("express");
const profileController = express.Router();
const User = require("../models/user");

profileController.get("/:id", (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }, "").exec((err, user) => {
    if (!user) {
      return next(err);
    }
    res.render("profiles/show", {
      user: user,
      session: req.session.currentUser,
    });
  });
});

profileController.post("/:id", (req, res, next) => {
  var id = req.params.id;
  const updates = {
    name: req.body.name,
    email: req.body.email,
    imageUrl: req.body.imageUrl,
    jobTitle: req.body.jobTitle,
    company: req.body.company,
    summary: req.body.summary,
  };

  User.findByIdAndUpdate(id, updates, (err, profile) => {
    if (err) {
      return next(err)
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
    res.redirect("/")
  }
});

// // FOLLOW & UNFOLLOW.
// profileController.use((req, res, next) => {
//   if (req.session.currentUser) { next(); }
//   else { res.redirect("/login"); }
// });
//
// profileController.post("/:username/follow", (req, res) => {
//   User.findOne({ "username": req.params.username }, "_id").exec((err, follow) => {
//     if (err) {
//       res.redirect("/profile/" + req.params.username);
//       return;
//     }
//
//     User
//       .findOne({ "username": req.session.currentUser.username })
//       .exec((err, currentUser) => {
//         var followingIndex = currentUser.following.indexOf(follow._id);
//
//         if (followingIndex > -1) {
//           currentUser.following.splice(followingIndex, 1)
//         } else {
//           currentUser.following.push(follow._id);
//         }
//
//         currentUser.save((err) => {
//           req.session.currentUser = currentUser;
//           res.redirect("/profile/" + req.params.username);
//         });
//       });
//   });
// });
//
// // TIMELINE
// profileController.get("/:username/timeline", (req, res) => {
//   const currentUser = req.session.currentUser;
//   // Includes yourself in the timeline.
//   currentUser.following.push(currentUser._id);
//
//   Tweet.find({ user_id: { $in: currentUser.following } })
//     .sort({ created_at: -1 })
//     .exec((err, timeline) => {
//       res.render("profile/timeline", {
//         username: currentUser.username,
//         timeline,
//         moment
//       });
//   });
// });

module.exports = profileController;
