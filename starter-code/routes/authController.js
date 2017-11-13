const express = require('express');
const authController = express.Router();

const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authController.get('/login', (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/");
    return;
  };

  res.render('authentication/login');
})

authController.post('/login', (req, res) => {
  let email    = req.body.email;
  let password = req.body.password;

  if (email === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate an email and a password to log in"
    });
    return;
  }

  User.findOne({ "email": email }, (err, user) => {
    if (err || !user) {
      res.render("authentication/login", { errorMessage: "The email doesn't exist" });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user; // Asi se puede acceder al User de la sesion
      res.redirect("/");
    } else {
      res.render("authentication/login", { errorMessage: "Incorrect password" });
    }
  });
});

authController.get('/signup', (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/");
    return;
  };
  
  res.render('authentication/signup');
});

authController.post('/signup', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ "email": email }, (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", { errorMessage: "The username already exists" });
      return;
    }

    var salt  = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: `Something went wrong when signing up: ${err}`
        });
      } else {
        res.redirect('/login');
      }
    });
  });
})

authController.get("/logout", (req, res) => {
  if (!req.session.currentUser) {
    res.redirect("/login");
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
