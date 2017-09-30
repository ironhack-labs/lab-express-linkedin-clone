const express = require('express');
const siteController = express.Router();

siteController.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/login')
    }
})

siteController.get('/home', (req, res, next) => {
    res.render('home', {
        currentUser: req.session.currentUser
    });
})

module.exports = siteController;