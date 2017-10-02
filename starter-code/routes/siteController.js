const express = require('express');
const siteController = express.Router();
const User = require('../models/user');
const moment = require('moment')

siteController.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login')
    }
})

siteController.get('/home', (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) { return next(err) }
        res.render('home', {
            currentUser: req.session.currentUser, users, moment
        })
    });
})

module.exports = siteController;