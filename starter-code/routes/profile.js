/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt  = require("bcrypt");
const saltRounds   = 10;


// Edit the User
router.get('/:userId/edit', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (!req.session.user) {
      res.redirect('/login');
    } else if (user.username === req.session.user.username) {
        res.render('profiles/edit', {
          user: user,
        });
    } else {
        return next(err);
    }
  });
});

// Info to update the user
router.post('/:userId', (req, res, next) => {
  const userId = req.params.userId;

  let updates = {
    name: req.body.name,
    email: req.body.email,
    imageUrl: req.body.imageUrl,
    summary: req.body.summary,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
    username: req.body.username
  };

  // User.findOne({"username" : req.body.username}, "username", (err, user) => {
  //   if (user !== null) {
  //     res.render('profiles/edit', {
  //       user: user,
  //       error: 'That username is already taken'
  //     });
  //   }
  // });

  if (req.body.password) {
    updates.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds));
  }

  User.findByIdAndUpdate(userId, updates, {new: true}, (err, user) => {
    if (err) {return next(err);}
    else {
      req.session.user = user;
      res.redirect('/welcome');
    }
  });
});


// Show the profile
router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (err) {return next(err);}
    else {
      console.log(req.session);
      res.render('profiles/show', {
        user: user,
        req: req.session.user
      });
    }
  });
});


module.exports = router;
