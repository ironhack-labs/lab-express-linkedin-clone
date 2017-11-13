const express        = require("express");
const auth = express.Router();

const User           = require("../models/User")
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

auth.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.redirect("/home");
  } else { res.redirect("/login"); }
});

auth.get("/login", (req, res, next) => {
  res.render("auth/login");
});

auth.post("/login", (req, res, next) => {
  const {name, password} = req.body;

  if (name === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a name and a password to log in"
    });
    return;
  }

  User.findOne({ "name": name }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The name doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          console.log(req.session);
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

auth.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

auth.post("/signup", (req, res, next) => {
  const {name, password, email} = req.body;
  console.log(req.body);

  if (name === "" || password === "" || name === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Complete all fields"
    });
    return;
  }

  User.findOne({ "name": name }, "name", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The name already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name,
      password: hashPass,
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


module.exports = auth;
