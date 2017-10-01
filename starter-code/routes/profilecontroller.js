const express = require('express');
const profileController = express.Router();

const User = require('../models/user');

profileController.get('/:id', (req, res, next) => {
    const profileId = req.params.id;

    User.findById(profileId, (err, profile) => {
        if (err) { return next(err); }
        res.render('profile/show', {profile})
    })
})

profileController.get('/:id/edit', (req, res, next) => {
    const profileId = req.params.id;
    const profileSessionId = req.session.currentUser._id;

    if(profileId === profileSessionId) {
        User.findById(profileId, (err, profile) => {
            if (err) { return next(err) }
            res.render('profile/edit', {
                profile, user: req.session.currentUser
            })
        })
    }
})

module.exports = profileController;
