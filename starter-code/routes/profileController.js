'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user').User;

/* SHOW, EDIT PROFILE */

// --- GET show user profile --- //
router.get('/:id', function(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (req.session.currentUser) { // If user is loged in
            if (req.session.currentUser.username === user.username) {
                res.render('profiles/show', { // If it's the profile owner
                    owner: true,
                    logged: true,
                    user: user,
                });
            } else {
                res.render('profiles/show', {
                    owner: false,
                    logged: true,
                    user: user,
                });
            }
        } else {
            res.render('profiles/show', {
                logged: false,
                user: user,
            });
        }
    });
});

// --- GET show user profile to edit --- //
router.get('/:id/edit', function(req, res, next) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (!user || err) { // If the user doesn't exist or there's an error
            return next(err);
        }
        if (req.session.currentUser && req.session.currentUser.username === user.username) {
            // If user's logged in and it's on its profile
            const data = {
                user: user
            };
            res.render('profiles/edit', data);
        } else {
            res.redirect('/auth');
        }
    });
});

// --- POST update edited profile --- //
router.post('/:id', function(req, res, next) {
    let userId = req.params.id;

    // Pick the user inputs
    const userInfo = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
        summary: req.body.summary,
        imageUrl: req.body.imageUrl,
        company: req.body.company,
        jobTitle: req.body.jobTitle
    };

    User.findByIdAndUpdate(userId, userInfo, (err) => { // Update user
        if (err) {
            return next(err);
        }
        res.redirect('/auth');
    });
});

module.exports = router;
