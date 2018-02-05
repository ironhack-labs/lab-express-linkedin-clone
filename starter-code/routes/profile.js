const express = require('express');
const User = require('../models/users');
const router = express.Router();

router.get('/profile/:userId', (req, res, next) => {
    User.findOne({
        _id: req.params.userId
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        res.render('profile/index', {
            user: user,
            title: 'Profile page',
            loggedIn: req.session.currentUser !== undefined
        });
    });
});

router.get('/profile/:userId/edit', (req, res, next) => {
    if (!req.session.currentUser || req.session.currentUser._id !== req.params.userId) {
        return res.redirect('/');
    }

    // res.render('profile/edit', {
    //     user: req.session.currentUser,
    //     title: 'Profile page',
    //     loggedIn: req.session.currentUser !== undefined
    // });

    User.findOne({
        _id: req.params.userId
    }, (err, user) => {
        if (err) {
            return next(err);
        }

        res.render('profile/edit', {
            user: user,
            title: 'Profile page',
            loggedIn: req.session.currentUser !== undefined
        });
    });
});

router.post('/profile/:userId', (req, res, next) => {
    const userInfo = {
        name: req.body.username,
        email: req.body.email,
        summary: req.body.summary,
        imageUrl: req.body.imageUrl,
        company: req.body.company,
        jobTitle: req.body.jobTitle
    };
    User.findOne({
        _id: req.params.userId
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        user.name = userInfo.name;
        user.email = userInfo.email;
        user.summary = userInfo.summary;
        user.imageUrl = userInfo.imageUrl;
        user.company = userInfo.company;
        user.jobTitle = userInfo.jobTitle;

        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.session.currentUser = user;
            return res.redirect('/profile/' + req.params.userId);
        });
    });
});

router.get('/profile', (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) {
            return next(err);
        }
        return res.render('profile/users', {
            title: "Users page",
            loggedIn: req.session.currentUser !== undefined,
            users: users
        });
    });
});

module.exports = router;