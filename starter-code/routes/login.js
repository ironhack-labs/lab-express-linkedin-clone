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
    res.render('authentication/login');
  }
});

router.post('/', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (req.body.username === '' || req.body.password === '') {
    res.render ('authentication/login', {
      errorMessage: "All fields required to log-in"
    });
    return;
  }

  User.findOne({"username" : username}, (err, user) => {
    if (!user) {
      res.render('authentication/login', { errorMessage: 'Invalid email or password.' });
    } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          req.session.user = user;
          console.log('req.session', req.session);
          res.redirect('welcome');
        } else {
          res.render('authentication/login', { errorMessage: 'Invalid email or password.' });
        }
      }
    });
  });

module.exports = router;
