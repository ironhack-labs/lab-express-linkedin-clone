const express = require('express');
const User = require('../models/user.js')

const router = express.Router();

const bcrypt = require("bcrypt");
const bcyptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("../views/authentication/signup.ejs");
}); 

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    let salt     = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
      }
    });
  });
});

module.exports = router;
