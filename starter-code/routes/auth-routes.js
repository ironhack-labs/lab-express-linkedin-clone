var express = require('express');
var authRoutes = express.Router();
const User = require('../models/user')

const bcrypt = require('bcrypt');
const bcryptSalt = 10;


/* GET login page. */
authRoutes.get('/login', function(req, res, next) {
  if (req.session.currentUser) {
    let userInfo = { info: req.session.currentUser}
    res.redirect('/');
  } else {
    res.render("auth/login");
  }
});

authRoutes.get('/signup', (req, res, next) => {
  if (!req.session.currentUser) {
    res.render('auth/signup')
  } else {
    res.redirect("/");
  }
})

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const name = req.body.name;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
    "username",
    (err, user) => {
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
        email,
        name
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
  });


authRoutes.post('/login', (req, res, next) => {
  const username = req.body.username
  let password = req.body.password

  if (username === "" || password === "") {
    res.render('auth/login', {
      errorMessage: 'enter your username and password to login'
    })
    return;
  }
  User.findOne({ 'username': username }, (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        errorMessage: 'the username does not exist'
      })
      return; 
    }
    if (bcrypt.compareSync(password, user.password)) {
      //Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login', {
        errorMessage: 'incorrect password'
      })
    }
  })
})

authRoutes.post("/logout", (req, res, next) => {
  req.session.currentUser = null;
  res.redirect("/auth/login");
});

module.exports = authRoutes;
