const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/users');

const bcryptSalt = 10;

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

/* GET sign up. */
router.get('/signup', function(req, res, next) {
  // if (req.session.currentUser) {
  //   return res.redirect('/');
  // }

  res.render('auth/signup');
});

/* POST sign up. */
router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;


  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    // va bé tenir un altre if per estructurar millor
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('auth/signup', data);
    }
    //un cop passa la validació encriptem la password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    //creem un nou user a la base de dades amb la info del post
    const newUser = new User({
      username,
      password: hashPass,
      name,
      email
    });
    //el salvem a la base de dades i redirigim directament a la home
    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      //req.session.currentUser = newUser;
      res.redirect('/');
    });
  });


  res.redirect('signup');
});

/* GET log in. */
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

/* POST log in. */
// router.post('/signup', function(req, res, next) {
//   res.render('signup');
// });

/* GET log out. */
router.get('/logout', function(req, res, next) {
  // res.render('/login');
});



module.exports = router;