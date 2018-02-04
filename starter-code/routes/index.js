const express = require('express');
const router = express.Router();
const Post = require("../models/post");
const User = require('../models/user');

/* GET INDEX */
router.get("/", (req,res,next) => {
  let user = req.session.currentUser;
  let posts = {};

  if(user){
    console.log("LOGGED")
  
    Post.find().exec((err, posts) => {
      console.log(posts)
      let postCreators = [];
      let creatorsSearch;
      posts.forEach((post) => {
        creatorsSearch = User.findById(post._creator).exec().then((err, user) =>{
          postCreators.push(user.name);
        }).catch(e => next(e));
      });
      creatorsSearch.then(err =>{
        console.log(postCreators)
        res.render('index', { user, posts: posts, postCreators});
      return;
    }).catch(e => next(e))
      
    })
  } else{
    console.log("NOT LOGGED")
    res.redirect("/login");
  }
});

module.exports = router;
