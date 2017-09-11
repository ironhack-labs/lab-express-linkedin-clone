var express = require('express');
var router = express.Router();
const User = require('../models/User');

router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;


  console.log(req.body)
});

module.exports = router;
