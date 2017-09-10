const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'login'
  });
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        console.log("estoy log");
        req.session.currentUser = user;
        console.log(user);
        res.render("basichome" , {user:user});
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    console.log("deslogeo");
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
