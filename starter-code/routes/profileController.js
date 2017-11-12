const express = require("express");
const User = require("../models/user");

const profileController = express.Router();


profileController.use((req, res, next) => {
  if (req.session.currentUser) {
    console.log(req.session.currentUser);
    next(); }
  else { res.redirect("/login"); }
});

profileController.get("/home", (req, res) => {
  res.render('home' , { user:
    { username: req.session.currentUser.username,
      password: req.session.currentUser.password,
      name: req.session.currentUser.name,
      email: req.session.currentUser.email } } );
})

module.exports = profileController;
