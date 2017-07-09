var express = require('express');
var bcrypt = require('bcrypt');
const bcryptSalt     = 10;
var User = require('../models/User');
var router = express.Router();

/* Render the login view. */
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});
/* Render the login view. */
router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    return res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

  User.findOne({
    "username": username
  }, (err, user) => {
    if (err) {
      return res.render("auth/login", {
        errorMessage: err
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.redirect("/");
      } else {

        return res.render("auth/login",{
          errorMessage: "Incorrect password, try again."
        });
      }
    }

  });

});

/* Render the signup view. */
router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

/* Create user on DB. */
router.post('/signup', function(req, res, next) {
  if (req.body.username === "" || req.body.password === "" || req.body.name === "" || req.body.email === "") {
    return res.render('auth/signup', {
      errorMessage: "Complete all the fields and try again."
    });
  }

  User.findOne({
    "username": req.body.username
  }, "username", (err, user) => {
    if (user !== null) {
      return res.render('auth/signup', {
        errorMessage: "The username already exists"
      });
    }
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var name = req.body.name;
    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: req.body.username,
      password: hashPass,
      email: email,
      name: name
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong, please try again."
        });
      } else {
        res.redirect("/");
      }
    });
  });
});
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});

module.exports = router;
