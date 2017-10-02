const express = require('express');
const profileController = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
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

profileController.post('/:id/edit', (req, res, next) => {
    const profileId = req.params.id;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(req.body.password, salt);

    const update = {
        username: req.body.username,
        password: req.body.password,
        name : req.body.name,
        email: req.body.email,
        summary: req.body.summary,
        company: req.body.company,
        jobTitle: req.body.jobTitle
    }

    User.findByIdAndUpdate(profileId, update, (err, profile) => {
        if(err) { return next(err) }

        return res.redirect(`/profile/${profileId}`)
    })
})

module.exports = profileController;
