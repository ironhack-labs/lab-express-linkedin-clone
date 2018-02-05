const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/:id', (req, res, next) => {
  const userID = req.params.id;
  User.findById(userID, (err, data) => {
    if (err) {
      return next(err);
    }
    let curUserProfile = false;
    if (data._id.equals(req.session.currentUser._id)) {
      curUserProfile = true;
    }
    let userInfo = {};
    if (req.session.currentUser) {
      userInfo = {
        data: {
          username: data.username,
          name: data.name,
          email: data.email,
          summary: data.summary,
          imageUrl: data.imageUrl,
          company: data.company,
          jobTitle: data.jobTitle,
          id: data.id,
          isUser: curUserProfile
        }
      };
    } else {
      userInfo = {
        data: {
          username: 'Private',
          name: data.name,
          email: 'Private',
          summary: 'Private',
          imageUrl: data.imageUrl,
          company: data.company,
          jobTitle: data.jobTitle
        }
      };
    }

    res.render('profiles/show', userInfo);
  });
});

router.get('/:userId/edit', (req, res, next) => {
  const userID = req.params.userId;
  if (req.session.currentUser._id === userID) {
    User.findById(userID, (err, data) => {
      if (err) {
        return next(err);
      }
      const userInfo = { info: data };
      res.render('profiles/edit', userInfo);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/:userId', (req, res, next) => {
  const userID = req.params.userId;
  const username = req.body.username;
  const name = req.body.name;
  const email = req.body.email;
  const summary = req.body.summary;
  const imageUrl = req.body.imageUrl;
  const company = req.body.company;
  const jobTitle = req.body.jobTitle;

  User.findByIdAndUpdate(
    userID,
    { $set:
      { username,
        name,
        email,
        summary,
        imageUrl,
        company,
        jobTitle
      } },
    { new: true },
    function (err, user) {
      if (err) {
        return next(err);
      }
      req.session.currentUser = user;
      res.redirect('/');
    }
  );
});

module.exports = router;
