/*jshint esversion: 6 */

const express      = require('express');
const router       = express.Router();
const Post         = require("../models/post");
const User        = require("../models/user");


// Create a new post
router.get('/:userId/posts/new', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else if (user.username === req.session.user.username) {
        res.render('posts/new', {
          user: user,
        });
    } else {
        return next(err);
    }
  });
});


// Post info about post
router.post('/:userId/posts', (req, res, next) => {
  const postInfo = {
    content: req.body.content,
    creator: req.session.user.username
  };
  console.log("neeewwwwwww!");
  const newPost = new Post(postInfo);
  console.log(newPost);
  newPost.save( (err) => {
    if (err) { next(err); }
    else {
      res.redirect('/users/' + req.params.userId + '/posts');
    }
  });
});


// Show users posts
router.get('/:userId/posts', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      Post.find({"creator" : user.username}, (err, posts) => {
         if (err) { return next(err); }
         else {
           res.render('posts/show', {
             posts: posts,
             userId: userId
           });
         }
       });
     }
   });
});


// Edit a users post
router.get('/:userId/posts/:postId/edit', (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  console.log(userId, postId, 'checkingggg');
  User.findById(userId, (err, user) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else if (user.username === req.session.user.username) {
        Post.findById(postId, (err, post) => {
          res.render('posts/edit', {
            user: user,
            post: post
          });
        });
    } else {
        return next(err);
    }
  });
});

router.post('/:userId/posts/:postId', (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  let updates = {
    content: req.body.content,
  };

  Post.findByIdAndUpdate(postId, updates, {new: true}, (err, post) => {
    if (err) {return next(err);}
    else {
      res.redirect('/users/' + userId + '/posts');
    }
  });
});


// Delete a post
router.get('/:userId/posts/:postId/delete', (req, res, next) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  User.findById(userId, (err, user) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else if (user.username === req.session.user.username) {
        Post.findByIdAndRemove(postId, (err, post) => {
          res.redirect('/users/' + userId + '/posts');
        });
    } else {
        return next(err);
    }
  });
});


module.exports = router;
