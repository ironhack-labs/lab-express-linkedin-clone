const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const router = express.Router();
const bcryptSalt = 10;

/* GET users listing. */
router.get("/signup", (req, res) => {
  res.render("authentication/signup");
});

router.post("/signup", (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({"username": username}, "username", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name: name,
      username: username,
      email: email,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/users/login");
    });
  });
});

router.get("/login", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/home");
  } else {
    res.render("authentication/login");
  }
});

router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/home");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/users/login');
});

module.exports = router;
