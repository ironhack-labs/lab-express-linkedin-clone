var express = require('express');
var router = express.Router();

// User model
const User           = require("../../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

//  REQUEST SIGNUP PAGE
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// USER SUBMITS INPUT
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email    = req.body.email;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //
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

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect("../auth/login");
      }
    });
  });
});

module.exports = router;
