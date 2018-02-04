const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

router.get("/profile/:id/posts/new", function(req, res) {
  console.log("GET NEW POST!");
  const userId = req.params.id;
  res.render("posts/new",{userId, errorMessage : undefined});
});

router.post("/profile/:id/posts", function(req, res){
  const userId = req.params.id;
  const content = req.body.content;
  const _creator = userId;
  if (content == "") {
    res.render("posts/new", { userId,
      errorMessage: "The post can't be empty"
    });
    return;
  }
  let newPost = Post({
    content,
    _creator: userId
  });
  console.log(newPost)

  newPost.save(err => {
    res.redirect(`/profile/${userId}`);
  });
})

module.exports = router;
