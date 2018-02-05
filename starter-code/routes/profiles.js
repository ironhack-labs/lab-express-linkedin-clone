'use strict';
const express = require('express');
const router = express.Router();

/* GET /profile/:userId/edit */
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }

  res.render('index');
});

/* POST /profile/:userId */

/* GET /profile/:userId */

module.exports = router;
