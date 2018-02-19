var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const Post = require("../models/Post");
const User = require("../models/User");

router.get("/:id/posts/new", function(req, res, next) {
    if(req.session.currentUser){
        res.render("posts/new", {user : req.session.currentUser._id})
      } else{
          res.redirect("/authentication/login")
      }
});


router.post("/:id/posts", function(req, res, next) {
    const post = new Post({
        content: req.body.content,
        _creator: req.params.id
      });
      post.save((err,result)=>{
      if(!err){
      return res.redirect("/");
  }
});
});

module.exports = router;