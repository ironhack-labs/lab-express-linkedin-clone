const express = require('express');
const router = express.Router();
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;

//GET EDIT
router.get("/profile/:id/edit",(req,res,next) => {
  //const currentUser = req.session.currentUser;
  //res.render("profiles/edit",{currentUser});
  const userId = req.params.id;
  User.findById(userId).exec().then( user => {
    console.log({user})
    res.render("profiles/edit", {user});
  }).catch(e => next(e))
});

//POST EDIT
router.post("/profile/:id/edit",(req,res,next) => {
  const userId = req.params.id;
  const currentUser = req.session.currentUser;

  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const jobTitle = req.body.jobTitle;
  const company = req.body.company;
  const summary = req.body.summary;
  const email = req.body.email;

  const updates = {name,imageUrl,jobTitle,company,summary,email};
  
  if (req.body.username != ""){
    updates.username = req.body.username;
  }
  if (req.body.password != ""){
    const password = req.body.password;
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);
    updates.password = hashPass;
  }

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    res.redirect(`/profile/${userId}`);
  });
});

// GET PROFILE 
router.get("/profile/:id", (req,res,next) => {
  const userId = req.params.id;
  const currentUser = req.session.currentUser;

  User.findById(userId).exec().then( user => {
    res.render("profiles/show", {user: user, currentUser : currentUser});
  }).catch(e => next(e))
});

module.exports = router;