const express = require('express');
const profileController = express.Router();

const User = require('../models/User');

profileController.get('/:userId/edit', (req, res)=> {
  let currentUserId = req.session.currentUser._id.toString();

  if(req.params.userId !== currentUserId){
    res.redirect('/');
    return;
  }

  let user = User.findById({ _id: currentUserId }, (err, user) => {
    res.render('profiles/edit', { user: user });
  });
});

profileController.post('/:userId', (req, res, next) => {
  let currentUserId = req.session.currentUser._id.toString();

  if(req.params.userId !== currentUserId){
    res.redirect('/');
    return;
  }

  let profileData = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  }

  User.findByIdAndUpdate(currentUserId, profileData, (err, user) => {
    err ? next(err) : res.redirect(`/profile/${user._id}/edit`);
  });
})

profileController.get('/:userId', (req, res, next) => {
  let currentUser = req.session.currentUser;
  let loggedIn = currentUser ? true : false;
  let editable;

  User.findById(req.params.userId, (err, user) => {
    if (err) {
      next(err);
      return;
    }

    if (loggedIn) {
      editable = currentUser._id.toString() === user._id.toString();
    }

    res.render('profiles/show', {
      user: user,
      loggedIn: loggedIn,
      editable: editable
    });
  })

})

module.exports = profileController;
