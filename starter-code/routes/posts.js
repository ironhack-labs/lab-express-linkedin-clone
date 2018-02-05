const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/profile/:id/posts/new", function(req, res) {
  const userId = req.params.id;
  res.render("posts/new",{userId, errorMessage : undefined});
});

router.post("/profile/:id/posts", function(req, res){
  const userId = req.params.id;
  const content = req.body.content;
  if (content == "") {
    res.render("posts/new", { userId,
      errorMessage: "The post can't be empty"
    });
    return;
  }
  User.findById(userId).exec((err, user) => {
    let newPost = Post({
      content,
      _creator: {userId, name: user.name}
    });
    newPost.save(err => {
      res.redirect(`/profile/${userId}`);
    });
  });
})
router.get("/profile/:id/posts/:postId/edit", function(req, res) {
  const userId = req.params.id;
  const postId = req.params.postId;

  Post.findById(postId).exec((err, post) => {
    res.render("posts/edit",{userId, post, errorMessage : undefined});
  });
});

router.post("/profile/:id/posts/:postId/edit", function(req, res) {
  const userId = req.params.id;
  const content = req.body.content;
  const postId = req.params.postId;
  
  const {name,price,imageUrl,description} = req.body;
  const updates = {name,price,imageUrl,description};
  if (content == "") {
    res.render("posts/new", { userId,
      errorMessage: "The post can't be empty"
    });
    return;
  }
  User.findById(userId).exec((err, user) => {
    let updates = {
      content,
      _creator: {userId,name: user.name}
    };
    Post.findByIdAndUpdate(postId, updates, (err, user) => {
      if (err){ return next(err); }
      res.redirect(`/profile/${userId}`);
    });
  });
});

module.exports = router;
