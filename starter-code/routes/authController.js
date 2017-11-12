const express        = require("express");
const authController = express.Router();

const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authController.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/home");
  } else { res.redirect("/login"); }
});

authController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authController.post("/login", (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          console.log(req.session);
          req.session.currentUser = user;
          res.redirect("/home");
          // logged in
          // res.redirect("/tweets");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
  const {username, password, name, email} = req.body;
  console.log(req.body);

  if (username === "" || password === "" || name === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Complete all fields"
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
      email
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.render("auth/login");
      }
    });
  });
});

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
