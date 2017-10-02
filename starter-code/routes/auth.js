const express = require("express");
const authRoute = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoute.get("/", (req, res, next) => {
  res.redirect("/auth/login");
});

authRoute.get("/signup", (req, res) => {
  res.render("auth/signup");
});

authRoute.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashedPass = bcrypt.hashSync(password, salt);

  if (name === "" || password === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Please fill in all fields before signin up"
    });
    return;
  }
  User.findOne({ name: name }, (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The name already exists"
      });
      return;
    }
    const newUser = new User({
      name,
      password: hashedPass,
      email
    });
    newUser.save(err => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signin up"
        });
      } else {
        res.render("index");
      }
    });
  });
});

authRoute.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authRoute.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.render("/auth/login", {
      errorMessage: "Please fill in your info to log in"
    });
  }
  User.findOne({ "email": email }, (err, user) => {
    if (err || !email) {
      res.render("auth/login", {
        errorMessage: "The email doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      const email = req.session.currentUser.email;
      res.render("auth/main", {
        email
      });

    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});



module.exports = authRoute;
