var express = require('express');
var router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");



router.post("/:userId/posts", (req, res, next) => {
  let content = req.body.content;
  let _creator = req.session.currentUser.username;
 
  User.findOne({ "_id": req.params.userId }, (err, user) => {
    
  const newPost  = Post({
    content,
    _creator
  });
  console.log('user ', user.posts);
   user.posts.push(newPost);
   user.save( (err) => {
    if (err) { throw err }
     res.redirect("/");   
  });  

 });
});

router.get('/:userId/posts/new', function(req, res, next) {
  let user = req.session.currentUser;
  res.render('posts/new', { user });
});



module.exports = router;
