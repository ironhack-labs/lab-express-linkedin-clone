const express = require('express');
const router = express.Router();
// User model
const User = require("../models/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/auth/login');
});

router.get('/home', function(req, res, next) {
  res.render('user/home',{session:req.session.currentUser});
  //res.send("HOLAAAA");
});

module.exports = router;
