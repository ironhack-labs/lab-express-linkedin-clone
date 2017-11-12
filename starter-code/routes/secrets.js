const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

router.get('/',isLoggedIn, (req,res) => {
  res.render('home');
});

module.exports = router;
