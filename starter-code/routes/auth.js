const User = require('../models/User');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const bcryptSalt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  let user = 0;
  if (user){
    res.render('home');
  } else{
    res.redirect('/login'); // COMPLETE
  }
});

router.get('/signup', function(req, res, next) {
  res.render('authentication/signup');
});

router.post('/signup', function(req, res, next) {
  // SAVE data username, password, name, email
});

router.get('/login', function(req, res, next) {
  res.render('authentication/login');
});

router.post('/login', function(req, res, next) {
// Start user session
});

router.get('/logout', function(req, res, next) {
// End user session
});
module.exports = router;
