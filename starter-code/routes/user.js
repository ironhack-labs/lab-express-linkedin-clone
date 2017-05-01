routes  = require("express").Router();
User    = require("../models/user");
auth    = require("../helpers/auth.js");

routes.get("/:userId/posts/new", auth.checkLoggedInAndSession("/authentication/login"), (req, res, next)=>{
  res.render('user/new', {userId:req.session.user._id});
});

routes.post("/:userId/posts", auth.checkLoggedInAndSession("/authentication/login"), (req, res, next)=>{
  console.log("here")
  User.findOneAndUpdate({"_id":req.params.userId},
                        {$push: {"posts":  req.body.post}},
                        {safe: true, upsert: true},
                        (err,user)=>{
                          if(err) { next(err); return; }
                          res.redirect('/');
                        })
});

module.exports = routes;

