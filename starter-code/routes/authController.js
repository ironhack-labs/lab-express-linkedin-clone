const express = require("express");
const authController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authController.get("/", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("login");
    return;
  }
    res.render("home", {user: req.session.currentUser});
})

// SIGNUP GET & POST
authController.get("/signup", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/signup");
    return;
  }
  res.redirect("/");
});

authController.post("/signup", (req, res, next) => {
  var name = req.body.name;
  var password = req.body.password;
  var email = req.body.email;

  if (name === "" || password === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a name, an email and a password to sign up"
    });
    return;
  }

  User.findOne({ "email": email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The email already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name,
      password: hashPass,
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

// LOGIN GET & POST
authController.get("/login", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/login");
    return;
  }
  res.redirect("/");
});

authController.post("/login", (req, res, next) => {
  var password = req.body.password;
  var email = req.body.email;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate an email and a password to log in"
    });
    return;
  }

  User.findOne({ "email": email },
    "_id name password email",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

// LOGOUT
authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = authController;
