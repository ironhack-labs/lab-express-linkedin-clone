var express = require('express');
var siteRoutes = express.Router();

const User = require('../models/user')


siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("auth/login");
    }
});
  
siteRoutes.get("/", (req, res, next) => {
    res.render("home");
});
module.exports = siteRoutes;
