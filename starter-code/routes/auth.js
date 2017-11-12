var express = require("express");
var router = express.Router();

// User model
const User = require("../models/user").User;

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET users listing. */

/* ----- LOGIN -------- */

router.get("/login", (req, res, next) => {
  const currentUser = req.session.currentUser;
  if (!currentUser) {
    const data = { user: currentUser };
    res.render("auth/login");
  } else {
    res.redirect("/profile/dashboard");
  }
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/profile/dashboard");
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password" });
    }
  });
});

/* ----- SIGNUP -------- */

router.get("/signup", (req, res, next) => {
  // // res.send("Signup!!");
  // res.render("auth/signup");
  const currentUser = req.session.currentUser;
  if (!currentUser) {
    const data = {
      user: currentUser
    };
    res.render("auth/signup");
  } else {
    res.redirect("../");
  }
});

router.post("/signup", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/");
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

/* ----- LOGOUT -------- */

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
