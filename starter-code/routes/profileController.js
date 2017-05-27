/* jshint esversion: 6, node: true */
'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:userId/edit', (req, res, next) => {
    const userIdArg = req.params.userId;
    const curUser = req.session.currentUser;

    if (!curUser || (curUser._id !== userIdArg)) {
        console.log('user not logged in OR trying to edit someone else\'s profile');
        return res.redirect('/');
    }

    User.findById(userIdArg, (err, userDoc) => {
      if (err) return next(err);
      res.render('profile/edit', {user: userDoc});
    });
});

router.get('/:userId', (req, res, next) => {
    const userIdArg = req.params.userId;
    const curUser = req.session.currentUser;

    User.findById(userIdArg, (err, userDoc) => {
        if (err) return next(err);
        if (!userDoc) {
            console.log('this user does not exist, can\'t show profile');
            return res.redirect('/');
        }
        // the user is logged in.
        if (curUser) {
            if (curUser._id === userIdArg) {
                // show private profile with Edit button.
                return res.render('profile/show', {
                    private: true,
                    userIsMe: true,
                    user: userDoc
                });
            } else {
                // show userId's private profile.
                return res.render('profile/show', {
                    private: true,
                    userIsMe: false,
                    user: userDoc
                });
            }
        } else { //user is not logged in.
            // show userId's public profile.
            return res.render('profile/show', {
                private: false,
                userIsMe: false,
                user: userDoc
            });
        }
    });


});

router.post('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  const {name, email, summary, imageUrl, company, jobTitle} = req.body;
  User.findByIdAndUpdate(userId,
    {name, email, summary, imageUrl, company, jobTitle}, (err, doc) => {
        if (err) return next(err);
        if (!doc){
          console.log('could not find user by ID after edit.');
          return res.redirect('/');
        }
        return res.redirect(`/profile/${userId}`);
    });
});

module.exports = router;
