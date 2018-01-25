const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');
const ensureLogin = require("connect-ensure-login");

module.exports.editProfile = (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        res.render('user/edit', { user: user });
    })
    .catch(error => {
        res.send("No se que situacion puede conducir a este error");
        //next(error);
    })
}

module.exports.profile = (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        console.log(req.user);
        if(req.params.userId == req.user._id) {
            console.log("MY PROFILE");
            res.render('user/profile', { user: user });
        }
        else {
            console.log("OTHER PROFILE");
            res.render('user/profile', { 
                user: {
                    name: user.name, 
                    summary: user.summary,
                    company: user.company,
                    jobTitle: user.jobTitle
                } 
            });
        }
    })
    .catch(error => {
        res.send("user not found");
    })
}

module.exports.doEditProfile = (req, res, next) => {
    modifiedUser = new User(req.body);
    User.findByIdAndUpdate(req.params.userId, 
        {
            name: req.body.name,
            summary: req.body.summary,
            imageUrl: req.body.imageUrl,
            company: req.body.company,
            jobTitle: req.body.jobTitle
        }
    ).then( user => {
        res.redirect(`/profile/${req.params.userId}`)
    })
}