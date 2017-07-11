const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

function authCheck(req, res, next) {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', authCheck, (req, res, next) => {

  Post.find({ }, (err, posts) => {
    if (err) { return next(err) }

    res.render('index', { posts, user: req.session.currentUser, });
  });

});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

router.get('/allprofiles', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) { return next(err) }
    res.render('profiles/profilelist', { users });
  });
});

router.get('/profile/:userId', (req, res, next) => {

  User.findById(req.params.userId, (err, data) => {
    if (err) {
      return next(err);
    };

    if(!req.session.currentUser || req.params.userId !== req.session.currentUser._id) {
      res.render('profiles/profile-public',  { data });
      return;
    }

    res.render('profiles/profile-private', { data });

  });
});

router.get('/profile/:userId/edit', (req, res, next) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      return next(err);
    };
    res.render('profiles/profile-private', { data });
  });
});

router.get('/users/:userId/posts/new', (req, res, next) => {
  const data = { _id: req.params.userId }
  res.render('posts/new', {data});
});

router.post('/profile/:userId', authCheck, (req, res, next) => {

  //The user should be redirected to the homepage if they're trying to edit a profile that isn't theirs.
  if(req.params.userId !== req.session.currentUser._id) {
    res.redirect('/');
    return;
  }

  const profileInfo = {
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.picture,
    company: req.body.company,
    jobTitle: req.body.jobtitle
  }

  User.update({ _id: req.params.userId}, profileInfo, (err) => {
    if (err) {
      next(err);
    } else {
      res.redirect('/');
    }
  });
});

router.post('/users/:userId/posts', (req, res, next) => {
  const content = req.body.content;
  const _creator = req.params.userId;

  const NewPost = Post({
    content,
    _creator
  });

  NewPost.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
