var express = require('express');
var router = express.Router();
const User = require("../../models/user")
const Post = require("../../models/post")

/* GET new post page page. */
router.get('/:userId/posts/new', (req,res,next) => {
  res.render('user/new', {user: req.session.currentUser });
})

/* POST post page */
router.post(('/:userId/posts'), (req, res, next) => {
  const newPost = Post({
    content: req.body.content,
    _creator: req.session.currentUser._Id
  })

  



  newPost.save((err) => {
    if (err) {
      res.render("users/new", {
        errorMessage: "Something went wrong whilst posting"
      });
    } else {
      user = req.session.currentUser;
      res.render('home', { newUser: user});
    }
  });
})

module.exports = router;
