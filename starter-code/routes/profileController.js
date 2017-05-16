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
    User.findOne({ _id: req.params.userId }, "_id name email summary company jobTitle").exec((err, user) => {
        if (!user) { return next(err); }
        //look for friendships with both users. Two as maximum. Te result is an array. If length is 0, there isn't a friendship. If the query returns 1 or 2 results , we have to inspect each one in order to see if the friendship[0] ( position 0 of the frienship array ) of one of the results corresponts to the currentUser ( req.session.currentUser._id ), who is the one that is following or unfollowing. If the friendship[0] of one of them coincides with currentUser, then the currentUser is already following the inspected user ( req.params.userId )
        Friendship.find({ $and: [ { "friendship.id": req.session.currentUser._id},  {"friendship.id": req.params.userId}] }, (err,result)=>{
          if(err){return next(err);}

          if(result.length === 0)
          {
            res.render('profile/show',{user:user, currentUser: req.session.currentUser, button_text:'Follow'});
          }
          else {
            let friendshipExists = false;
            result.forEach((element)=>{
              if(element.friendship[0].id == req.session.currentUser._id)
              {
                friendshipExists = true;
              }
            });

            if(friendshipExists)
            {
              res.render('profile/show',{user:user, currentUser: req.session.currentUser, button_text:'Unfollow'});
            }
            else
            {
              res.render('profile/show',{user:user, currentUser: req.session.currentUser, button_text:'Follow'});
            }
          }
        });
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
    if (!req.session.currentUser || req.session.currentUser._id == req.params.userId) {
      return res.redirect('/login');
    }

    User.findOne({ "_id": req.params.userId}, "_id").exec((err, follow) => {
    if (err) {
      res.redirect("/profile/" + req.params.userId);
      return;
    }

    var newFriendship = Friendship({
      friendship : [{id:req.session.currentUser._id},{id:follow._id}]
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

profileController.post("/:userId/unfollow", (req, res, next) => {
    if (!req.session.currentUser || req.session.currentUser._id == req.params.userId) {
      return res.redirect('/login');
    }

    Friendship.find({ $and: [ { "friendship.id": req.session.currentUser._id},  {"friendship.id": req.params.userId}] }, (err,result)=>{
      if(err){return next(err);}

      if(result.length === 0)
      {
        res.render('profile/show',{user:user, currentUser: req.session.currentUser, button_text:'Follow'});
      }
      else {
        let friendshipId;
        let friendshipExists = false;
        result.forEach((element)=>{
          if(element.friendship[0].id == req.session.currentUser._id)
          {
            friendshipExists = true;
            friendshipId = element._id;
          }
        });

        if(friendshipExists)
        {
          Friendship.deleteOne({_id:friendshipId},(err)=>{
            if(err){
              next(error);
            }
            res.redirect('/');
          });
        }
        else
        {
          return res.redirect('/');
        }
      }
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
