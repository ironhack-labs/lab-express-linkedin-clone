const express = require("express");
const authRoutes = express.Router();
const path = require('path');
const debug = require('debug')(`m2-0118-basic-auth:${path.basename(__filename).split('.')[0]}`);

const bodyParser = require("body-parser");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require("../models/User");




authRoutes.get("/signup", (req, res, next) => {
  console.log("entramos en signup");
  res.render("authentication/signup");
});

authRoutes.post("/signup", (req, res, next) => {

  console.log(req.body);
  const {
    username,
    email,
    password,
    summary,
    imgUrl,
    company,
    jobTitle
  } = req.body;

  if (username === "" || password === "" || email ==="") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username, a email and a password to sign up"
    });
    return;
  }

  User.findOne({
      "username": username
    }).exec()
    .then(user => {
      if (user) {
        console.log("Prueba: ", user.username);
        res.render("authentication/signup", {
          errorMessage: "The username already exists"
        });
      }
    })
    .then(() => {

      var salt = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

      var newUser = User({
        username,
        email,
        password: hashPass,
        summary,
        imgUrl,
        company,
        jobTitle
      });


      newUser.save()
        .then(() => {
          res.redirect("/");
        })
        .catch(err => next(err))

    });

});

authRoutes.get('/login', (req, res, next) => {
  console.log("entramos en login");
  res.render('authentication/login', { title: "Login" });
});

authRoutes.post("/login", (req, res, next) => {
  console.log("entramos en el post de login");
  const {username,password} = req.body;

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
        debug(`${user.username} is now logged in`);
        res.redirect("/home");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});


authRoutes.get('/logout',(req,res) => {
  req.session.currentUser = null;
  res.redirect('/');
})

module.exports = authRoutes;