var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

/* Profile usuario*/
router.get('/:userId', function(req, res, next) {
    if(req.session.currentUser){
        //console.log(req.session.currentUser._id)
        return res.render("profile", {user:req.session.currentUser})
    } else {
      return res.redirect("/login");
    }
  });

/* edit */

router.get('/:userId/edit', function(req, res, next) {
    return res.render("edit", {user:req.session.currentUser}) 
    
})

router.post("/:userId/edit", (req,res)=>{
    var userId = req.session.currentUser._id; 
    var updates = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        summary: req.body.summary,
        imageUrl: req.body.imageUrl,
        company: req.body.company,
        jobTitle: req.body.jobTitle,
    }

  
    User.findByIdAndUpdate(userId, updates, (err, user) => {
        if (err){ return next(err); }
        return res.redirect("profile/"+userId);
      });
})

/* Profile */
router.get('/', function(req, res, next) {
    //console.log("----------->")
    if(req.session.currentUser){
        var userId = req.session.currentUser._id;
        return res.redirect("profile/"+userId);
    } else {
      return res.redirect("/login");
    }
  });

  module.exports = router;

