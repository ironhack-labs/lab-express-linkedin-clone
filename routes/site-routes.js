const express = require('express');

const siteRoutes = express.Router();

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

siteRoutes.get('/', (req, res, next) => {
  res.render('profile/show', { user: req.session.currentUser });
});

module.exports = siteRoutes;
