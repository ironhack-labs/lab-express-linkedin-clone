const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup', { title: 'HOME' });
});

router.post('/signup', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }


  User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      let salt = bcrypt.genSaltSync(bcryptSalt);
      let hashPass = bcrypt.hashSync(password, salt);

      let newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
});

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login Page' });
});


router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});


module.exports = router;
