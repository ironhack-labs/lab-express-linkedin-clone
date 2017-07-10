const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

function authCheck(req, res, next) {
  if(req.session.currentUser) {
    res.redirect('/');
  } else {
    next();
  }
}

router.get('/login', authCheck, (req, res, next) => {
  res.render('auth/login');
});

router.get('/signup', authCheck, (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const fullname = req.body.fullname;
  const email = req.body.email;

  if (username === "" || password === "" || fullname === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Fill all fields to sign up."
    });
    return;
  }

  User.findOne({ "username": username }, //search condition
  "username", //projection!
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
  });

  const salt     = await bcrypt.genSalt(bcryptSalt);
  const hashPass = await bcrypt.hash(password, salt);

  const newUser  = User({
    username,
    password: hashPass,
    fullname,
    email
  });

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

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

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
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

module.exports = router;
