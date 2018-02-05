'use strict'

// Use of express
const express = require("express");
const authRoutes = express.Router();

// User model
const User           = require("../routes/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


// Render Signup Form
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// Store Signup Post values
authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser  = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  });
});

module.exports = authRoutes;
