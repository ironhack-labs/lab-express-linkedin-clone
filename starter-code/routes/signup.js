/*jshint esversion: 6 */

const express      = require('express');
const router       = express.Router();
const User         = require("../models/user");
const bcrypt       = require("bcrypt");
const saltRounds   = 10;
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);

router.get('/', (req, res, next) => {
  if (req.session.user) {
    res.redirect('welcome');
  } else {
    res.render('authentication/signup');
  }
});

router.post('/', (req, res, next) => {

  const newUser = User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds)),
      name: req.body.name,
      email: req.body.email
  });

  if (req.body.username === '' || req.body.password === '' || req.body.name === '' || req.body.email === '') {
    res.render ('authentication/signup', {
      errorMessage: "All fields required to sign-up"
    });
    return;
  }

  User.findOne({"username" : newUser.username}, "username", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "That username already exists"
      });
      return;
    }

    newUser.save((err, user) => {
      if (err) {
        res.render("authentication/signup", {
           errorMessage: "Something went wrong when signing up"
         });
      } else {
        req.session.user = user;
        console.log(req.session);
        res.redirect('welcome');
      }
    });
  });

});

module.exports = router;
