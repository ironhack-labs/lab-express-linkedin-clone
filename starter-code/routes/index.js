const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const bcryptSalt = 10; // WHY?

router.get('/', (req, res, next) => {
  if (true/* !req.session.currentUser */) {
    return res.redirect('/login');
  }
  res.render('index', { title: 'Welcome' });
});

router.get('/signup', (req, res, next) => {
  if (false/* req.session.currentUser */) {
    return res.redirect('/');
  }

  const data = {
    title: 'Sign Up Today!'
  };
  res.render('signup', data); // render etc IS NOT a full (or even a) browser path - it looks in views folder and
  // gives you whatever's in orange here... (eg in his example it's 'auth/signup')
});

router.post('/signup', (req, res, next) => {
  if (false/* req.session.currentUser */) {
    return res.redirect('/'); // Redirect IS a full path for brow to look for!
  }

  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // INPUT VAIDATION
  //

  // Does that username already exist?
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      email, /* 'Automatic' key value assignment - look into */
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      // req.session.currentUser = newUser; //UNDERSTAND THIS BETTER
      res.redirect('/');
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/logout', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
