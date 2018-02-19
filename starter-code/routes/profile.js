var express = require('express');
var router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require('bcrypt');

/* Profile usuario*/
router.get('/:userId', function(req, res, next) {
    if(req.session.currentUser){
        //console.log(req.session.currentUser._id)
        User.find({}, (err, docs)=>{
            if(err) res.status(500).send(err);
            return res.render("profile", {user:req.session.currentUser, users:docs})
          });
        
    } else {
      return res.redirect("/login");
    }
  });
  /* posts */
  router.post('/:userId', function(req, res, next) {
    const post = new Post({
        body: req.body.body,
        user_id: req.session.currentUser._id,
        user_name: req.session.currentUser.userName,
    });
    post.save((err, result)=>{
    if(err) return res.send(err);
    res.redirect("/");
    }); 
  })

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



/* Profile general*/
router.get('/', function(req, res, next) {
    //console.log("----------->")
    if(req.session.currentUser){
        var userId = req.session.currentUser._id;
        return res.redirect("profile/"+userId);
    } else {

        User.find({}, (err, docs)=>{
            console.log(docs);
            if(err) res.status(500).send(err);
            res.render("show", {users:docs}) 
          });

      
    }
  });

  module.exports = router;

