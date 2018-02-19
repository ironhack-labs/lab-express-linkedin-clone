var express = require('express');
var router = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
//const bcryptSalt     = 10;


router.get("/:userId/edit", (req,res,next)=>{
  const id=req.params.userId;
  console.log(id);
  User.findById(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else{
          res.render("profile/edit",{user:doc});
      }
  });
});


router.post("/:userId", (req,res,next)=>{
    const profileId=req.params.userId;
    console.log(id);
    const updatedProfile={
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        summary:req.body.summary,
        imageUrl:req.body.imageUrl,
        company:req.body.company,
        jobTitle:req.body.jobTitle
            
    };
    User.findByIdAndUpdate(profileId, updatedProfile, (err, profile) => {
      if (err){ return next(err); }
      return res.redirect('/profile');
    });
  });


  router.get("/:userId", (req,res,next)=>{
    const id=req.params.userId;
    if (!req.session.currentUser) { res.redirect("/"); return; }
    User.findById(id,(err,doc)=>{
        if (err){
            next();
            return err;
        }else{
            res.render("profile/show",{user:doc,editUserId:req.session.currentUser._id,login:true})
        }
    });
  });


  


























/* GET users listing. */
router.get('/', function(req, res, next) {
    var login=true;
    if (!req.session.currentUser) {login=false;}
    User.find({}, "_id username").exec((err, doc) => {
      if (!doc) { return;}
      if (login){
        res.render("profile/show", {user:doc,editUserId:req.session.currentUser._id,login:login});
      }else{
        res.render("profile/show", {user:doc,editUserId:0,login:login}); 
      }
     
     });
});

module.exports = router;
