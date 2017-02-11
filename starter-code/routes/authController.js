//will define the routes we need to create the basic authorization

const express = require("express");
const authController = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authController.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var summary  = req.body.summary;
  var imageUrl  = req.body.imageUrl;
  var company  = req.body.company;
  var jobTitle  = req.body.jobTitle;

  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

///check if  user and password are blank
  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
// /// Checjs if userName already exists
  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

// Create the user
    var newUser = User({
      username,
      password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitles
    });

//save the new user onto the Database
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong"
          });
        } else {
            res.redirect("/");
            }
      });
  });
});

module.exports = authController;
