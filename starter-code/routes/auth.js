const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const bcryptSalt = 10;

/* GET login page. */
router.get('/login', function (req, res, next) {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Login' });
});

/* POST login page. */
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    const data = {
      title: 'Login',
      message: 'Indicate a username and a password to sign up'
    };
    return res.render('login', data);
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      return res.render('auth/login', data);
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      res.render('auth/login', data);
    }
  });
});

/* render the signup form. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const data = {
    title: 'Signup'
  };
  res.render('auth/signup', data);
});

/* handle the POST from the signup form. */
router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const summary = req.body.summary;
  const email = req.body.email;
  const company = req.body.company;
  const jobTitle = req.body.jobTitle;
  const imageUrl = req.body.imageUrl;

  // validate
  if (username === '' || password === '') {
    const data = {
      title: 'Signup',
      message: 'Try again'
    };
    return res.render('auth/signup', data);
  }

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashPass,
      summary,
      email,
      imageUrl,
      company,
      jobTitle
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = newUser;
      res.redirect('/');
    });
  });
});

/* handle the POST from the logout button. */
router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = router;
