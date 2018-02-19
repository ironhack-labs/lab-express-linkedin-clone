var express = require('express');
var router = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
//const bcryptSalt     = 10;

// GET /profile/:userId/edit - This will allow the user to edit their own profile. 
// The user should be redirected to the homepage if they're trying to edit a profile that isn't theirs.

router.get("/:userId/edit", (req,res,next)=>{
  const id=req.params.userId;
  User.findById(id,(err,doc)=>{
      if (err){
          next();
          return err;
      }else if (req.session.currentUser._id==id){
          res.render("profile/edit",{user:doc});
      }else{
          res.redirect("/")
      }
  });
});

router.post("/:userId", (req,res,next)=>{
    const profileId=req.params.userId;
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
        console.log("8========D")
        console.log("profile")
        res.render("profile/show",{user:doc,userSession:req.session.currentUser._id})
      });
 });

    router.get("/:userId", (req,res,next)=>{
        const id=req.params.userId;
        User.findById(id,(err,doc)=>{
            if (err){
                next();
                return err;
            }else if (req.session.currentUsers){
                    res.render("profile/show",{user:doc,userSession:req.session.currentUser._id})
            }else{
                    res.render("profile/show",{user:doc,userSession:undefined})
            }
        });
      });
    


/* GET users listing. este es profile*/
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
