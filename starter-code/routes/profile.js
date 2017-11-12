const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get("/:userId", (req, res) => {
  let userId = req.params.userId;
  let currentUser = req.session.currentUser;
  User.findOne({"_id": userId}, (err, user) => {
    if (user !== null) {
      var showUser = {
        id: user._id,
        name: user.name,
        username : user.username,
        email: user.email,
        summary: user.summary,
        image: user.imageUrl,
        company: user.company,
        jobTitle: user.jobTitle,
        ownProfile: false,
        isLogged: false
      };
    }

    if (currentUser) {
      showUser.isLogged = true;
      if (currentUser._id === userId) {
        showUser.ownProfile = true;
      }
    }

    res.render("profiles/show", showUser);
  });
});

router.post("/:userId", (req, res) => {
  let userId = req.params.userId;
  let currentUser = req.session.currentUser;
  let userInfo = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  }

  User.findByIdAndUpdate(currentUser._id , userInfo, (err, user) => {
    if (err) { return next(err); }
    return res.redirect(`/profile/${userId}`);
  });
});

router.get("/:userId/edit", (req, res) => {
  let userId = req.params.userId;
  let currentUser = req.session.currentUser;
  if (currentUser._id === userId) {
    res.render("profiles/edit", currentUser);
  } else {
    res.redirect("/home");
  }
});

module.exports= router;
