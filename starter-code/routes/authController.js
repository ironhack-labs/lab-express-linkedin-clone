/*jshint esversion:6*/

const express = require("express");
const authController = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authController.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});


//First: Signup
authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;

  if (username === "" || password === "" ||
    email === "" || summary === "" ||
    imageUrl === "" || company === "" || jobTitle === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate all requeriments to sign up"
    });
    return;
  }

  User.findOne({
    "username": username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      email,
      password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitle,
    });

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});

authController.get("/", (req, res) => {
  let user = req.session.currentUser;
  if (req.session.currentUser) {
    res.render("home", {
      user
    });
  }
  res.redirect("/login");
});


//Second: Login
authController.get("/login", (req, res, next) => {
  res.render("authentication/login");
});

authController.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  // var email = req.body.email;
  // var summary = req.body.summary;
  // var imageUrl = req.body.imageUrl;
  // var company = req.body.company;
  // var jobTitle = req.body.jobTitle;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }
  User.findOne({
      "username": username
    },
    "_id username password following",
    (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render("home", {
            user
            // summary,
            // imageUrl,
            // company,
            // jobTitle
          });
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
    });
});

//third: Logout
authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = authController;


// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('home', {
//     title: 'Ironhack Linkedin'
//   });
// });
//
// module.exports = router;
