/*jshint esversion: 6*/
const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/user");
// Friendship model
const Friendship  = require("../models/friendship");

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

profileController.post("/:userId/follow", (req, res, next) => {
    if (!req.session.currentUser) {
      return res.redirect('/login');
    }

    User.findOne({ "_id": req.params.userId}, "_id").exec((err, follow) => {
    if (err) {
      res.redirect("/profile/" + req.params.userId);
      return;
    }

    var friendshipArray = [];

    friendshipArray.push(req.session.currentUser._id);
    friendshipArray.push(follow._id);

     var newFriendship = Friendship({
       friendship : friendshipArray
     });

    newFriendship.save((err) => {
      if (err) {
        next(error);
      }
      else
      {
        res.redirect("/");
      }
    });
  });
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

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;

  // console.log("hi");
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

  // console.log("editUser",editUser);

  let userId = req.params.id;
  let erroFound = false;
  let errorMessage = [];

  if(name==="")
  {
    errorMessage.push("Indicate a name to edit");
    erroFound = true;
  }

  if(email==="")
  {
    errorMessage.push("Indicate an email to edit");
    erroFound = true;
  }

  if(password ==="")
  {
    errorMessage.push("Indicate a password to edit");
    erroFound = true;
  }

  let currentUser;
  User.findById({_id:userId}, (err, user) => {
    if (err) {
      next(err);
    } else {
      currentUser = user;

      if(erroFound)
      {
        res.render('profile/edit', { user: currentUser,errorMessage: errorMessage});
      }
      else
      {

        User.find({email:email}, (err, user) => {
          // console.log("user ",user);
          // console.log("userId ",userId );
          if (user !== null)
          {
            if(user[0]._id != userId)
            {
              errorMessage.push("The email already exists");
              res.render('profile/edit', { user:currentUser,
                errorMessage: errorMessage
              });
              return;
            }
            else
            {
              User.findByIdAndUpdate({_id:userId}, editUser, (err)=>{
                if(err){
                  next(err);
                }
                else
                {
                  res.redirect('/');
                }
              });
            }
          }
          else
          {
            User.findByIdAndUpdate({_id:userId}, editUser, (err)=>{
              if(err){
                next(err);
              }
              else
              {
                res.redirect('/');
              }
            });
          }
        });
      }
    }
  });
});


module.exports = profileController;
