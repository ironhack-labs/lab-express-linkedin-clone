const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt         = require("bcrypt");



//GET log-in page
router.get('/logIn', function(req, res, next) {
  res.render('logIn');
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("logIn", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("logIn", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("welcome");
      } else {
        res.render("logIn", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

module.exports = router;
