const express = require('express');
const profile = express.Router();

const User = require('../models/user');

profile.get('/:username',(req, res, next) => {
// if viewer isn't logged in, show them the limited info
  if(!req.session.currentUser) {
    User.findOne({username: req.params.username}, '_id username name image job company').exec((err, user) => { // to get more info on the profile, need to add to the 'id username name section'
      // console.log("DEBUG PROFILE ONE " + user.name);
      // console.log("DEBUG PROFILE TWO " + JSON.stringify(user));
      // console.log("DEBUG PROFILE THREE " + JSON.stringify(req.params));
      if(!user) {
        return next(err);
    } else {
      res.render('profile/show',
      {name: user.name,
      image: user.image,
      job: user.job,
      company: user.company}
        );
      }
    });
  }
// if viewer is logged in
  if(req.session.currentUser) {
    User.findOne({username: req.params.username}, '_id username name image job company summary email').exec((err, user) => { // to get more info on the profile, need to add to the 'id username name section'
      // console.log("DEBUG PROFILE ONE " + user.name);
      // console.log("DEBUG PROFILE TWO " + JSON.stringify(user));
      // console.log("DEBUG PROFILE THREE " + JSON.stringify(req.params));
      if(!user) {
        return next(err);
    } else {
      res.render('profile/fullshow',
      {name: user.name,
      image: user.image,
      job: user.job,
      company: user.company,
      summary: user.summary,
      email: user.email,
      username: user.username}
        );
      }
    });
  }

});

module.exports = profile;
