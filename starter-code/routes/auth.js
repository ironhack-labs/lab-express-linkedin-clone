const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let summary = req.body.summary;
  let company = req.body.company;
  let jobTitle = req.body.jobTitle;
  let imageUrl = req.body.imageUrl;

  if (email === "" || password === "") {
      res.render("auth/signup", {
        errorMessage: "Indicate email and a password to sign up"
      });
      return;
    }

    User.findOne({ "email": email }, "email", (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "Someone is already register with this email"
        });
        return;
      }

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser  = User({
    name,
    email,
    password: hashPass,
    summary,
    company,
    jobTitle,
    imageUrl
  });

  newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      }
      else {
        res.redirect("/login");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a email and a password to log in"
    });
    return;
  }

  User.findOne({ "email": email },
    "_id email password following",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          console.log(req.session.currentUser);
          res.redirect("/profile");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
