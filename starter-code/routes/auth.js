const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const debug = require('debug')('basic-auth:'+ path.basename(__filename));
const router = express.Router();
const bcryptSalt = 5;

router.get('/', (req, res) => {
  res.render('home', { title: 'LinkedIn' });
});

router.get('/signup', (req, res) => {
  res.render('authentication/signup', { title: 'Signup' });
});

router.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const summary = req.body.summary;
  const imageUrl = req.body.imageUrl;
  const company = req.body.company;
  const jobTitle = req.body.jobTitle;

  // Server-sided form security
  if (email === "" || password === ""){
    res.render("authentication/signup", {
      errorMessage: "Missing email or password"
    });
  }

  // Look for user email before signing up
  User.findOne({ "email": email },
    "email",
    (err, user) => {
      if (user !== null) {
        res.render("authentication/signup", {
          errorMessage: "Sorry, that email is already in use.."
        });
        return;
      }

      // Password encryption
      let salt = bcrypt.genSaltSync(bcryptSalt);
      let hashPass = bcrypt.hashSync(password, salt);

      // User creation
      let newUser = User({
        name,
        email,
        password: hashPass,
        summary,
        imageUrl,
        company,
        jobTitle
      });

      newUser.save((err) => {
        res.redirect("/login");
      });
    });
});

router.get('/login', (req, res) => {
  res.render('authentication/login', { title: 'Login' });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate an email and a password to login"
    });
    return;
  }

  User.findOne({ "email": email }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "That specific email does not exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render("./home", { user: user });
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

router.get('/logout', (req,res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});


module.exports = router;
