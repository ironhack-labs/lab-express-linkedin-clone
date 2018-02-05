const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
    res.render("login/login");
});

router.post("/", (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
   

    if (username === "" || password === "") {
        res.render("login/login", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
            res.render("login/login", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/");
            console.log(user._id);
        } else {
            res.render("login/login", {
                errorMessage: "Incorrect password"
            });
        }
    });
});

module.exports = router;