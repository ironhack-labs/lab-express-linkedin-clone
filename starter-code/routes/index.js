const express = require('express');
const router = express.Router();
const Post = require("../models/post");
const User = require('../models/user');

/* GET INDEX */
router.get("/", (req,res,next) => {
  let user = req.session.currentUser;
  
  if(user){
  
  Post.find().exec((err, posts) => {
    console.log(posts)
    res.render('index', { user, posts});
  });
 

    
    
  } else{
    console.log("NOT LOGGED")
    res.redirect("/login");
  }
});

module.exports = router;