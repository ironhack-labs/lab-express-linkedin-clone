const express = require("express");
const authRoutes = express.Router();
// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {

  if (req.session.currentUser) {
    console.log(req.session.currentUser)
    res.render("home", {
      username: req.session.currentUser.username,
      id: req.session.currentUser._id,
    });
  } else {
    res.render("authentication/signup");
  }
  });


authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var email = req.body.email;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "" || name === "" || email === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
      "username": username
    },
    (err, user) => {
      if (user !== null) {
        res.render("authentication/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      var salt = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

      var newUser = User({
        username,
        password: hashPass
      });

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
});

authRoutes.get("/login", (req, res, next) => {
if (req.session.currentUser) {
  res.render("home", {
    username: req.session.currentUser.username,
  });
} else {
  res.render("authentication/login");
}
});



authRoutes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
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
        res.render("home", {
          username: username,
          session: req.session.currentUser,
          id: req.session.currentUser._id,
        });
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
