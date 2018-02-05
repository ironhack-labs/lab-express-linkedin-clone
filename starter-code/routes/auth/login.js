var express = require('express');
var router = express.Router();

// User model
const User           = require("../../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// Redirect to login
router.get("/auth", (req, res) => {
  res.redirect("/login");
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username  following",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          //saves login in the session
          req.session.currentUser = user;
          // When User logged in 
          res.redirect("/home");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

router.get("/login", (req, res, next) => {
  if (!req.session.currentUser) { 
    res.redirect("/auth/login"); 
    return; 
  }
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/auth/login");
    }
  });
});

module.exports = router;