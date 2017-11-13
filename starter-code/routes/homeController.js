const express = require('express');
const homeController = express.Router();

homeController.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/login")
});

homeController.get('/', function(req, res) {
  res.render('home', { name: req.session.currentUser.name });
});

module.exports = homeController;
