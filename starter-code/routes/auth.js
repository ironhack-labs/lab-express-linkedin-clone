const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// GET signup page.
router.get('/signup', (req, res) => {
  res.render('authentication/signup');
});

// POST signup page.
router.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const summary = req.body.summary;
  const imageURL = req.body.imageURL;
  const company = req.body.company;
  const jobtittle = req.body.jobtittle;

  if (username === "" || password === "" || email === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username, an email and a password to sign up"
    });
    return;
  }

  User.findOne({ "email": email }, "email", (err, user) => {
      if (user !== null) {
        res.render("authentication/signup", {
          errorMessage: "The email already exists"
        });
        return;
      }

      let salt     = bcrypt.genSaltSync(bcryptSalt);
      let hashPass = bcrypt.hashSync(password, salt);

      let newUser = new User({
        username,
        password: hashPass,
        email,
        summary,
        imageURL,
        company,
        jobtittle
      });

      newUser.save((err) => {
        res.redirect("/login");
      });
    });
});

// GET login page.
router.get('/login', (req, res) => {
  res.render('authentication/login');
});

// POST login page
// The log in is doing using the email.
router.post("/login", (req, res, next) => {
  const {email, password} = req.body;

  if (email === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate an email and a password to sign up"
    });
    return;
  }

  User.findOne({ "email": email }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The email doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.render('./home', {user: user});
      }
      else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

router.get('/logout', (req,res) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
