var express = require('express');
var router = express.Router();

const User = require('../models/user');

function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.render('home', { title: 'LinkedIn', userName: req.session.currentUser.username });
});

module.exports = router;
