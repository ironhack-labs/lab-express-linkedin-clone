const express = require("express");
const authRoutes = express.Router();
// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;

  User.findOne({ "username": username }, 
  "username",
  (err, user) => {
    if (user !== null) {
      console.log('user exists');
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
  });

  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser  = User({
    username,
    password: hashPass,
    name,
    summary,
    imageUrl,
    company,
    jobTitle
  });

  if (username === "" || password === "") {
  res.render("authentication/signup", {
    errorMessage: "Indicate a username and a password to sign up"
  });
  return;
}

  newUser.save((err) => {
  if (err) {
    res.render("authentication/signup", {
      errorMessage: "Something went wrong"
    });
  } else {
    res.redirect("/");
  }
});
});


authRoutes.get("/login", (req, res, next) => {
    if (req.session.currentUser) { 
        res.redirect("/");      
    } else {
        res.render("authentication/login");
    }
 
});

authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    return res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

authRoutes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = authRoutes;
