const express = require('express');

// User model
const User = require('../models/User');
const auth = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

auth.get('/', function(req, res, next) {
  if(req.session.currentUser) {
    res.render("home");
  } else {
    res.render("auth/login");
  }
});

auth.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

auth.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var email = req.body.email;

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

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass,
      name,
      email,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});


auth.get("/login", (req, res, next) => {
  if(req.session.currentUser) {
    res.redirect("/");
  } else {
    res.render("auth/login");
  }
});

auth.get("/home", (req, res, next) => {
  if(req.session.currentUser) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

auth.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username password", //filtro que hacemos sobre el collection
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/home");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

auth.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

auth.get("/home", (req, res, next) => {

  if(req.session.currentUser) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

module.exports = auth;
