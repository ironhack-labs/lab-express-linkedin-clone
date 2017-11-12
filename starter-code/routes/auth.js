const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
  res.render('authentication/login');
});

router.get('/signup', (req, res, next) => {
  res.render('authentication/signup');
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  if (username === "" || password === "" || email === "") {
    res.redirect("/", {
      errorMessage: "Indicate a username, email and a password to sign up"
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

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      email,
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
