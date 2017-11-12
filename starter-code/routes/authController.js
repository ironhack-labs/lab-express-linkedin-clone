'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user').User;
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* SIGN UP, LOG IN, LOG OUT */

// --- GET logged in homepage --- //
router.get('/', function(req, res) {
    User.findOne({
        username: req.session.currentUser.username
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        const data = {
            user: user
        };
        res.render('auth/welcome', data);
    });
});

// --- GET show signup form --- //
router.get('/signup', function(req, res) {
    if (req.session.currentUser) {
        res.render('auth/goToProfile');
    } else {
        res.render('auth/signup');
    }
});

// --- GET show login form --- //
router.get('/login', function(req, res) {
    if (req.session.currentUser) { // If the user is already logged in
        res.render('auth/goToProfile');
    } else {
        res.render('auth/login');
    }
});

// --- GET logout --- //
router.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/auth');
        return;
    }

    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

// --- POST sign up user --- //
router.post('/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo = {
        username: username,
        password: hashPass,
        name: req.body.name,
        email: req.body.email
    };

    const newUser = new User(userInfo);

    // check if username already exists
    User.findOne({
        username: username
    }, (err, user) => {
        if (user) {
            res.render('auth/signup', {
                errorMessage: `The username '${username}' is taken`
            });
        } else {
            newUser.save((err) => {
                res.redirect('/auth/login');
            });
        }
    });
});

// --- POST log in user --- //
router.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // If the user hasn't written one of them
    if (username === '' || password === '') {
        res.render('auth/login', { // Render again the login page with a message
            errorMessage: 'Indicate a username and a password to sign in'
        });
        return;
    }

    User.findOne({
        'username': username
    }, (err, user) => {
        if (err || !user) { // If the username is not found on the DB
            res.rener('auth/login', { // Render again the login page with a message
                errorMessage: "The username doesn't exist"
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) { // Check if password is correct
            req.session.currentUser = user; // Save the user in the session
            res.redirect('/auth');
            if (req.session);
        } else {
            res.render('auth/login', { // If password is incorrect, render again the login
                errorMessage: 'Incorrect password'
            });
        }
    });
});

module.exports = router;
