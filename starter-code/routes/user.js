var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/', function(req, res, next) {
  User.find({}, (err, users) => {
    console.log(users);
    if (err) {
        next();
        return err;
      } else {
        res.render('users', {users: users});
      }
  });
});

router.get('/profile/:userId/edit', function(req, res, next) {
  if (req.session.currentUser._id === req.params.userId) {
    User.findById(req.params.userId, (err, user) => {
    if(err){
      next();
      return err;
    }
    res.render('profile/edit', {user: user});
  });
  } else {
    res.redirect('/');
  }
});

router.post('/profile/:userId', function(req, res, next) {
  let {email, summary, imageUrl, company, jobTitle} = req.body;
    let edits = {
      email,
      summary,
      imageUrl,
      company,
      jobTitle
    };
    User.findByIdAndUpdate(req.params.userId, edits, (err, user) => {
      console.log(user);
      if(err){
        next();
        return err;
      }
      res.redirect(`/users/profile/${user._id}`);
    });
});

router.get('/profile/:userId', function(req, res, next) {
console.log(req.params.userId);
console.log(req.session.currentUser._id);
  if (req.session.currentUser._id === req.params.userId) {
    User.findById(req.params.userId, (err, user) => {
        if(err){
          next();
          return err;
        }
        res.render('profile/show', {
          user: user,
          session: req.session.currentUser,
          profile: false
        });
      });
  } else if(req.session !== undefined){
    User.findById(req.params.userId, (err, user) => {
        if(err){
          next();
          return err;
        }
        res.render('profile/show', {
          user: user,
          profile: true,
          session: req.session.currentUser
        });
      });
  } else {
    User.findById(req.params.userId, (err, user) => {
        if(err){
          next();
          return err;
        }
        res.render('profile/show', {
          user: user,
          profile: false,
          session: req.session.currentUser
        });
      });
  }
});

//FEED

router.get('/:userId/posts/new', function(req, res, next) {
  Post.find({}, (err, posts) => {
    console.log(posts);
    if (err) {
        next();
        return err;
      } else {
        res.render('posts/new', {
          posts: posts
        });
      }
  });
});

router.post('/:userId/posts', function(req, res, next) {
  var username;
  User.findById(req.params.userId, (err, user) => {
      if(err){
        next();
        return err;
      }
      username = user.username;
      console.log(username);

      const newPost = Post({
        content: req.body.post,
        _creator: username
      });

      newPost.save((err) => {
        if (err) {
          res.redirect("/", {
            errorMessage: "Something went wrong"
          });
        } else {
          console.log(`new post created`);
          res.redirect(`/users/:${req.params.userId}/posts/new`);
        }
      });
    });
});

router.get('/:postId/edit', function(req, res, next) {
  Post.findById(req.params.postId, (err, post) => {
    console.log(post);
    if (err) {
        next();
        return err;
      } else {
        res.render('posts/edit', {
          post: post
        });
      }
  });
});

router.post('/:postId', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.postId, {content: req.body.content}, (err, user) => {
      console.log(user);
      if(err){
        next();
        return err;
      }
      res.redirect(`/users/${req.session.currentUser._id}/posts/new`);
    });
});

module.exports = router;
