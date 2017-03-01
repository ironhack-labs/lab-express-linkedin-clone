const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const linkedInRouter = express.Router();

/* GET users listing. */
LinkedInRouter.get('/', (req, res, next) => {
  res.render('/home');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup-view.ejs', {
      errorMessage: 'Please fill out both username and password foo\'!'
    });
    return;
  }
  User.findOne(
    { username: username },
    { username: 1 },
    (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }
      if (foundUser !== null) {
        res.render('auth/signup.ejs', {
          errorMessage: 'The username already exists'
        });
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const userInfo = {
        username: username,
        password: hashPass
      };
      const theUser = new User(userInfo);
      theUser.save((err) => {
        if (err) {
          res.render('auth/signup.ejs', {
            errorMessage: 'Oops! There was a problem. Try again later.'
          });
          return;
        }
        res.redirect('/');
      });
    });
});

module.exports = router;
