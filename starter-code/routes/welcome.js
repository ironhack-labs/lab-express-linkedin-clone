/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const User = require("../models/user");

router.get('/', (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
      res.render('welcome', {
        user: req.session.user
  });
  }
});

module.exports = router;
