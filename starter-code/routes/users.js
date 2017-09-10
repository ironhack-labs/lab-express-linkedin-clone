const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;

//INDEX
router.get('/', (req, res) => {
  res.render('index');
});

//GET SignUp
router.get('/signup', (req, res) => {
  res.render('signup');
});

//POST SignUp - Creates a user in db
router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  if (username === "" || password === "" || name ==="" | email ==="") {
    res.render("signup", {
      errorMessage: "Fill all the fields to sign up"
    });
    return;
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        username: username,
        password: hashPass,
        name: name,
        email: email
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });
});

//GET Login
router.get('/login', (req, res) => {
  res.render('login');
});

//POST Login
router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        console.log(req.session.currentUser);
        res.redirect("/");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("login");
  });
});

module.exports = router;
