/*jshint esversion: 6*/
const express           = require("express");
const postsController   = express.Router();
const User              = require("../models/user");
const Post              = require("../models/post");
const moment            = require("moment");
// Friendship model
const Friendship  = require("../models/friendship");


postsController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

postsController.get("/posts", (req, res, next) => {
  const currentUser = req.session.currentUser;
  //an array for all the id that the currentUser has friendship with
  let friendshipArray=[];
  //explained in profileController. In this case, seeis friendship[0] of each result, and if it coincides with the currentUser._id, pushes the friendship[1] (the user with who the currentUser has a friendship) into an array of id's that will be used to look for the posts in the posts collection that have been created by a determinated user and marked with its user._id in user_id
  Friendship.find({ "friendship.id": req.session.currentUser._id},(err,result)=>{
    if(err){return next(err);}

    if(result.length === 0)
    {
      return res.render('posts/post-following');
    }
    else {

      result.forEach((element)=>{
        if(element.friendship[0].id == req.session.currentUser._id)
        {
          friendshipArray.push(element.friendship[1].id);
        }
      });
      friendshipArray.push(req.session.currentUser._id);
      console.log("friendshipArray",friendshipArray);
      Post.find({ user_id: { $in: friendshipArray } }).sort({ created_at: -1 }).exec((err, timeline) => {
      res.render("posts/post-following", {
        username: currentUser.name,
        timeline,
        moment
      });
  });

    }
  });
});

postsController.get("/users/:userId/posts", (req, res, next) => {
  console.log("hi");
  User
    .findOne({ _id: req.params.userId }, "_id email name")
    .exec((err, user) => {
      if (!user) { return; }
      // console.log("user.email",user.email);
      Post.find({ "user_email": user.email }, "post created_at")
        .sort({ created_at: -1 })
        .exec((err, posts) => {
          // console.log("posts",posts);
          res.render("posts/index",
            {
              user,
              currentUser : req.session.currentUser,
              posts,
              moment,
             });
        });
  });
});

postsController.get("/users/:userId/posts/new", (req, res, next) => {
  if(req.session.currentUser._id != req.params.userId)
  {
    return res.redirect('/');
  }
  else
  {
    res.render("posts/new",
      { user: req.session.currentUser });
  }

});

postsController.post("/users/:userId/posts", (req, res, next) => {

  if(req.session.currentUser._id != req.params.userId)
  {
    return res.redirect('/');
  }
  else
  {
    const user  = req.session.currentUser;

    User.findOne({ email: user.email }).exec((err, user) => {
      if (err) { return; }

      const newPost = Post({
        user_id:   user._id,
        user_email: user.email,
        user_name: user.name,
        post:     req.body.postText
      });

      newPost.save((err) => {
        if (err) {
          res.render("posts/new",
            {
              user: user,
              errorMessage: err.errors.post.message
            });
        } else {
          res.redirect("/");
        }
      });
    });
  }
});

module.exports = postsController;
