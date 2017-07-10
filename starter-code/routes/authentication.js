var express = require('express');
var bcrypt = require('bcrypt');
const bcryptSalt = 10;
var User = require('../models/User');
var router = express.Router();

function withTitle(c, title) {
  c.title = title || 'undefined title';
  return c;
}

router.get('/signup', function(req, res, next) {
  res.render('signup', withTitle({}, 'Sign up'));
});

router.post('/signup', function(req, res, next) {
  if (req.body.username === "" || req.body.password === "" || req.body.email === "") {
    return res.render('signup',
      withTitle({
        errorMessage: "Fill the form to sign up"
      }, "Sign up"));
  }

  User.findOne({
    "email": req.body.email
  }, "email", (err, user) => {
    if (user !== null) {
      return res.render('signup',
        withTitle({
          errorMessage: "This e-mail is already registered"
        }, "Sign up"));
    }
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: req.body.username,
      email: req.body.email,
      summary: '',
      imageURL: '',
      company: '',
      jobTitle: '',
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", withTitle({
          errorMessage: "Something went wrong"
        }, "Sign up"));
      } else {
        res.redirect("/");
      }
    });
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', withTitle({}, 'Log in'));
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (email === "" || password === "") {
    return res.render("login", withTitle({
      errorMessage: "Indicate a username and a password to sign in"
    }, 'Log in'));
  }

  User.findOne({
    'email': email
  }, (err, user) => {
    if (err) {
      return res.render("login", withTitle({
        errorMessage: err
      }, 'Log in'));
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        return res.render("login", withTitle({
          errorMessage: "Password incorrect"
        }, 'Log in'));
      }
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = router;
