const express = require("express");
const router = express.Router();

// get user model
const User = require("../models/user").User;
// encrypt pw with bcrypt
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET auth listing. */

// -- SIGNUP --
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/profile/homepage/");
    return;
  }

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    password: hashPass,
    email
  });

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Please type in your username and password"
    });
    return;
  }

  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "Username already exists"
      });
      return;
    }
    newUser.save(err => {
      req.session.currentUser = newUser;
      res.redirect("/");
    });
  });
});

// -- LOGIN --
router.get("/login", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/profile/homepage");
    return;
  }
  res.render("auth/login", { title: "login" });
});

router.post("/login", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/");
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", { errorMessage: "The username doesn't exist" });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/profile/homepage");
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password" });
    }
  });
});

// -- LOGOUT --
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
