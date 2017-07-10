
var express = require('express');
var router = express.Router();
const User = require('../models/user');

router.get('/users', function(req, res, next) {
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

router.get('/profile/:userId', function(req, res, next) {

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
          profile: true
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
          profile: false
        });
      });
  }

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



module.exports = router;


module.exports = router;
