const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const moment = require("moment");

const profileController = express.Router();

profileController.get('/profile/:userId', (req,res) => {
  let id = req.params.userId;
  let current = false;
  let isLogged = false;

  if(req.session.currentUser){
    isLogged = true;
    current = (id === req.session.currentUser._id) ? true : false;
  }

  User.findById(id, (err, user) => {
      if (err || !user) {
        res.render("home");
        return;
      } else {
        res.render("profile/show" , { user: user, current: current, isLogged: isLogged });
      }
    });
});

profileController.use((req, res, next) => {
  if (req.session.currentUser) {
    next(); }
  else { res.redirect("/login"); }
});

//REFACTOR
profileController.get("/home", (req, res) => {
  Post
    .find({}, "content creator created_at")
    .sort({ created_at: -1 })
    .exec((err, posts) => {
      res.render("home", { posts, moment,  user:
        { username: req.session.currentUser.username,
          password: req.session.currentUser.password,
          name: req.session.currentUser.name,
          email: req.session.currentUser.email } });
  });

});

profileController.get("/profile/:userId/edit" , (req, res) => {
  if(req.session.currentUser.username != req.params.userId){
     res.redirect("/home");
  } else {
    res.render('profile/edit', { user: req.session.currentUser });
  }
});

profileController.post("/profile/:userId" , (req, res) => {
  let id = req.params.userId;

  //REFACTOR
  const updates = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  };

  // Parameter {new : true} so on the callback it return the new user instead the previoues one
  User.findByIdAndUpdate(id, updates, {new : true}, (err, user) => {
    if (err){ return next(err); }
    console.log(user);
    req.session.currentUser = user;
    return res.redirect('/home');
  });
});



module.exports = profileController;
