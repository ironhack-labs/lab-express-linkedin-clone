const express = require('express');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/User');
const router = express.Router();

router.get('/signup', function(req, res, next) {
  if (req.session.currentUser !== undefined) {
    res.redirect('/');
  } else {
    res.render('auth/signup');
  }

});

router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (username === "" || password === "" || email === "") {
    return res.render('auth/signup', {
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

  User.findOne({
    "username": username
  }, "username", (err, user) => {
    if (user !== null) {
      return res.render('signup', {
        errorMessage: "The username already exists"
      });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass,
      email: email,
      summary: "",
      imageUrl: "",
      company: "",
      jobTitle: ""
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        console.log(`new user: ${username} created`);
        res.redirect("/");
      }
    });
  });
});

router.get('/login', function(req, res, next) {
  console.log(req.session);
  if (req.session.currentUser !== undefined) {
    res.redirect('/');
  } else {
    res.render('auth/login');
  }
});

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

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
      console.log(user);
      if (bcrypt.compareSync(password, user.password)) {
        console.log("correct Password");
        req.session.currentUser = user;
        return res.redirect("/");
      } else {
        console.log("wrong Password");
        return res.render("auth/login", {
          errorMessage: "wrong password, try again"
        });
      }
    }

  });

});

router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    res.render("auth/login");
  });
  console.log(req.session);
});

module.exports = router;
