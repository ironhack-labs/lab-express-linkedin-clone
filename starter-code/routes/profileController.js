/*jshint esversion: 6*/
const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/user");

//Bcrypt to encrypt passwords
const bcrypt            =require('bcrypt');
const bcryptSalt        =10;


profileController.get("/:userId", (req, res, next) => {
  if (req.session.currentUser) {
    console.log("hi",req.session.currentUser._id);
    console.log("hi2",req.params.userId);
    User.findOne({ _id: req.params.userId }, "_id name email summary company jobTitle").exec((err, user) => {
        if (!user) { return next(err); }
        res.render('profile/show',{user:user, currentUser: req.session.currentUser});
    });
  }
  else {
    User.findOne({ _id: req.params.userId }, "name company jobTitle").exec((err, user) => {
        if (!user) { return next(err); }
        res.render('profile/show',{user:user});
    });
  }
});

profileController.get("/:userId/edit", (req, res, next) => {
  if(req.session.currentUser._id != req.params.userId) {
    { res.redirect("/"); return; }
  }
  let userId = req.params.userId;
  User.findById({_id:userId}, (err, user) => {
    if (err) {
      next(err);
    } else {
      res.render('profile/edit', { user: user });
    }
  });
});

profileController.post('/:id/edit', (req, res, next) => {
  console.log("hi3");
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;
  console.log("hi2");
  // if (req.body.email === "" || req.body.password === "") {
  //   res.render('profile/edit', {
  //     errorMessage: "Indicate a email and a password to sign up"
  //   });
  //   return;
  // }
  //
  // User.findOne({ "email": email }, "email", (err, user) => {
  //   if (user !== null &&) {
  //     res.render('profile/edit', {
  //       errorMessage: "The user already exists"
  //     });
  //     return;
  // }
  console.log("hi");
    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var editUser = User({
      name,
      email,
      password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitle,
      _id: req.params.id
    });

  console.log("editUser",editUser);

  let userId = req.params.id;
  User.findByIdAndUpdate({_id:userId}, editUser, (err)=>{
    if(err){
      next(err);
    }
    else {
      console.log("hi4");
      res.redirect('/');
    }
  });
});


module.exports = profileController;
