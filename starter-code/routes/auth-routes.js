const express = require("express");
const authRoutes = express.Router();

const bcrypt = require("bcrypt");
let bcryptSalt = 10;

const User = require('../models/User');

authRoutes.get("/", (req, res) =>{
  res.redirect('/home');
})

authRoutes.get("/home", (req, res)=>{
  res.render("home");
})

authRoutes.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

authRoutes.post("/signup", (req, res, next) =>{
  let email = req.body.email;
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser  = User({
    email,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/login");
  });
})

authRoutes.get("/login", (req, res, next) => {
  res.render("authentication/login");
})

authRoutes.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Type a username and password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "This username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("authentication/login", {
          errorMessage: "Wrong password"
        });
      }
  });
});

authRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});

authRoutes.get("/secret", (req, res, next) => {
  res.render("secret");
});

module.exports = authRoutes;
