'use strict';
/* jshint esversion: 6, node: true */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 7;
const User = require('../models/User');

// routes
router.get('/', (req, res, next) => {
    const user = req.session.currentUser;
    if (user) {
        res.render('home', {
            user
        });
        return;
    }
    res.redirect('/login');
});

router.get('/login', (req, res, next) => {
    const user = req.session.currentUser;
    if (user) {
        res.render('home', {
            user
        });
        return;
    }
    res.render('authentication/login');
});

router.post('/login', (req, res, next) => {
    const {
        userName,
        password
    } = req.body;

    if (userName === '' || password === '') {
        return res.render('authentication/login', {
            errorMsg: "username/password cannot be blank."
        });
    }

    User.findOne({
        userName
    }, (err, user) => {
        if (err || !user) {
            return res.render('authentication/login', {
                errorMsg: "username does not exist."
            });
        }
        bcrypt.compare(password, user.password, (err, isValid) => {
            if (err) return next(err);
            if (!isValid) {
                return res.render('authentication/login', {
                    errorMsg: "username/password combination is incorrect."
                });
            }
            req.session.currentUser = {
                _id: user._id,
                userName,
                name: user.name,
                email: user.email
            };
            res.redirect('/');
        });
    });
});

router.get('/signup', (req, res, next) => {
    const user = req.session.currentUser;
    if (user) {
        res.render('home', {
            user
        });
        return;
    }
    res.render('authentication/signup');
});

router.post('/signup', (req, res, next) => {
    const {
        userName,
        password,
        name,
        email
    } = req.body;

    if (userName === '' || password === '') {
        return res.render('authentication/signup', {
            errorMsg: "username/password cannot be blank."
        });
    }
    User.findOne({
        userName
    }, (err, user) => {
        if (err) return next(err);
        if (user) return res.render('authentication/signup', {
            errorMsg: "That username already exists."
        });

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) return next(err);

            const newUser = User({
                userName,
                password: hash,
                name,
                email
            });
            newUser.save((err, userDoc) => {
                if (err) return next(err);
                res.redirect('/login');
            });
        });

    });
});

router.post('/logout', (req, res, next) => {
    const user = req.session.currentUser;
    if (user) {
        req.session.destroy((err) => {
            if (err) return next(err);
        });
    }
    return res.redirect('/login');
});

module.exports = router;
