const express = require('express');
const router = express.Router();
const User = require("../models/User");

router.get("/profile/:id/edit",(req,res,next) => {
  const userId = req.params.id;
  User.findById(userId).exec().then( user => {
    console.log({user})
    res.render("profiles/edit", {user});
  }).catch(e => next(e))
});

router.post("/profile/:id/edit",(req,res,next) => {
  const userId = req.params.id;
  const currentUser = req.session.currentUser;

  const name = req.body.name;


  const updates = {name};
  
  if (req.body.username != ""){
    updates.username = req.body.username;
  }

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    res.redirect(`/`);
  });
});

router.get("/profile/:id", (req,res,next) => {
  const userId = req.params.id;
  const currentUser = req.session.currentUser;

  User.findById(userId).exec().then( user => {
    res.render("profiles/show", {user: user, currentUser : currentUser});
  }).catch(e => next(e))
});

  module.exports = router;