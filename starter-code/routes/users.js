const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;

//INDEX
router.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.render('index', {
      user: req.session.currentUser.name
    });
  }
  else {
    res.render('index', {
      user: 'not logged in'
    });
  }
});

//GET SignUp
router.get('/signup', (req, res) => {
  res.render('signup');
});

//POST SignUp - Creates a user in db
router.post('/signup', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;

  if (name === "" || password === "" || name ==="" | email ==="") {
    res.render("signup", {
      errorMessage: "Fill all the fields to sign up"
    });
    return;
  }

  User.findOne({ "name": name }).then(user =>{
    if(user){
      res.render("signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        name: name,
        password: hashPass,
        email: email,
        summary: "",
        imageUrl: "",
        company: "",
        jobTite: ""
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });
});

//GET Login
router.get('/login', (req, res) => {
  if (req.session.currentUser) {
    console.log("ya estas conectado");
    res.redirect ('/');
  }
  else {
    res.render('login');
  }
});

//POST Login
router.post("/login", (req, res, next) => {
  var name = req.body.name;
  var password = req.body.password;

  if (name === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a name and a password to sign up"
    });
    return;
  }

  User.findOne({ "name": name }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The name doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
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
    res.redirect("/");
  });
});

module.exports = router;
