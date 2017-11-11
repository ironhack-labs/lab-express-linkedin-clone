const express = require("express");
const router = express.Router();

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login",{session:req.session.currentUser});
});


router.post("/login", (req, res, next) => {
  var userName = req.body.userName;
  var password = req.body.password;

  if (userName === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "userName": userName },
    "_id userName name password",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render('user/home',{session:req.session.currentUser});
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup",{session:req.session.currentUser});
});

router.post("/signup", (req, res, next) => {
  let userName = req.body.userName;
  let password = req.body.password;
  let email = req.body.email;
  let name = req.body.name;
  if (userName === "" || password === "" || email === "" || name === "") {
    res.render("auth/signup", {
      errorMessage: "Fill all inputs to sign up"
    });
    return;
  }

  User.findOne({ "userName": userName }, "userName", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    let salt     = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);
    let newUser = new User({
      userName,
      password: hashPass,
      email,
      name
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

router.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/login");
    return;
  }
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("auth/login");
    }
  });
});

module.exports = router;
