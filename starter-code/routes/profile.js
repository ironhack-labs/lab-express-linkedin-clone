routes  = require("express").Router();
User    = require("../models/user");
auth    = require("../helpers/auth.js");

routes.get("/:userId/edit", auth.checkLoggedInAndSession("/authentication/login"), (req, res, next)=>{
    User.findOne({"_id":req.params.userId}, (err, user)=>{
      res.render('profile/edit', {user})
    })
    
});

routes.post("/:userId", auth.checkLoggedInAndSession("/authentication/login"), (req, res, next)=>{
  const userId = req.params.userId;

  User.findOneAndUpdate({"_id":userId}, {
      name:req.body.name,
      email:req.body.email,
      summary:req.body.summary,
      imageUrl:req.body.imageUrl,
      company:req.body.company,
      jobTitle:req.body.jobTitle
    },
    (err, user)=>{
      if(err) {
        next(err);
        return;
      }
      res.redirect('/');
    })
});

routes.get("/:userId", auth.checkLoggedIn("/authentication/login"), (req, res, next)=>{
    User.findOne({"_id":req.params.userId}, (err, user)=>{
      var showOwn = req.params.userId === req.session.user._id;
      res.render('profile/show', {user, showOwn})
    })
 
});

module.exports = routes;