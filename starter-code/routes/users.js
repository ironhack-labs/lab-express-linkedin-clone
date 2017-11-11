const express = require('express');
const router = express.Router();
const canGo = require('../middlewares/canGo');
const User = require("../models/User");

/* GET  */
router.get('/', function(req, res, next) {
  res.redirect('/auth/login');
});

router.get('/home',canGo,(req, res, next)=> {
  res.render('user/home');
});

module.exports = router;
