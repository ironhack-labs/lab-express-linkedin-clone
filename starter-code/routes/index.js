'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }

  res.render('index', { currentUserId: req.session.currentUser._id });
});

module.exports = router;
