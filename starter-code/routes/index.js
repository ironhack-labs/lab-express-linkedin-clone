var express = require('express');
var router = express.Router();

const User = require("../models/User");

const Post = require("../models/Post");

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.currentUser){
    User.findOne({_id:req.session.currentUser._id}, (err,doc)=>{
      if(err){
          res.redirect("/");
      } else {
        Post.find({}, (err2, doc2)=>{
          if(err2){
            res.redirect("/");
        } else {
          let connectArray = []
          for (var t=0; t<doc.connections.length;t++){
            connectArray.push(doc.connections[t].id);
          }
          User.find({}, (err3,doc3)=>{
            if(err3){
                res.redirect("/");
            } else {
              return res.render('main/index', { title: 'LinkedIn', user: doc, connectedPosts: doc2, connectArray: connectArray, suggestions : doc3});
            }
          });
          }
        });
      }
    });
  } else{
  res.redirect("authentication/login")
  }
});

module.exports = router;
