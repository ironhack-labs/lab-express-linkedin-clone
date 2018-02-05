const express = require('express');
const bcrypt = require('bcryptjs');
const bcryptSalt = 14;
const router = express.Router();

const User = require('../models/users');
const Post = require('../models/posts');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', (req, res, next) => {
  res.render('users/signup', {title: 'Signup page', loggedIn: req.session.currentUser !== undefined});
});

router.post('/signup', (req, res, next) => {
  const userInfo = {
    name: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };
   if(!userInfo.name || !userInfo.password) {
     return res.render ('users/signup', { errors : "Pleaser enter username and password"});
   }


  bcrypt.genSalt(bcryptSalt, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(userInfo.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      const newUser = new User(userInfo);

      newUser.password = hash;

      newUser.save((err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/users/login');
      });
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('users/login', {title: 'Login page', loggedIn: req.session.currentUser !== undefined});
});

router.post('/login', (req, res, next) => {
  const userInfo = {
    name: req.body.username,
    password: req.body.password,
  };
  if(!userInfo.name || !userInfo.password) {
    return res.render ('users/login', { errors : "Pleaser enter username and password"});
  }


  User.findOne({
    name: userInfo.name
  }, (err, user) => {
    if (err || !user) {
      return res.render('users/login', {
        title: "Login page",
        errors: "The username doesn't exist",
        loggedIn: false
      });
    }
    bcrypt.compare(userInfo.password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }
      if (result) {
        req.session.currentUser = user;
        return res.redirect('/');
      }
      return res.render('users/login', {
        errors: "Error password"
      });
    });
  });

  router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
      if(err){return next(err);}
      return res.redirect('/users/login');
    });
  }); 
});
module.exports = router;