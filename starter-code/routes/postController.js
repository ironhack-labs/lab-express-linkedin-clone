const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const moment = require('moment')
const postController = express.Router();

postController.use((req, res, next) => {
    if (req.session.currentUser) { next() }
    else { res.redirect('/login') }
})

postController.get("/:id/", (req, res, next) => {
  User.findOne(
    { username: req.session.currentUser.username },
    "_id username"
  ).exec((err, user) => {
    if (!user) {
      return;
    }

    Post.find({ user_name: user.username }, "post created_at")
      .sort({ created_at: -1 })
      .exec((err, posts) => {
        res.render("posts/new", {
          username: user.username,
          posts,
          moment
        });
      });
  });
}); 
 
postController.post('/:id/', (req, res, next) => {
    const user = req.session.currentUser;
    
    User.findOne({username: user.username}).exec((err, user) => {
/*         if (err) { return }
 */
        const newPost = new Post({
            _creator: user._id,
            user_name: user.username,
            content: req.body.postText
        })
        
        newPost.save((err) => {
            if (err) {
                res.render('posts/new', {
                    username: user.username,
                    errorMessage: err.errors.post.message
                })
                
            }else {
                res.redirect('/profile')
            }
        })
    })
})

module.exports = postController;