const express = require('express');
const router = express.Router();
const User = require("../models/User");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
    res.render("signup")
})
router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    if (username === "" || password === "" || email === "") {
        res.render("signup", {
            errorMessage: "Indicate a username,password to sign up and an email"
        });
        return;
    } else if (!email.includes("@")) {
        res.render("signup", {
            errorMessage: "Enter a valid email, please"
        });    
        return;
    }
    User.findOne({ "username": username },
        "username",
        (err, user) => {
            if (user !== null) {
                res.render("signup", {
                    errorMessage: "The username already exists"
                });
                return;
            }
            let salt = bcrypt.genSaltSync(bcryptSalt);
            let hashPass = bcrypt.hashSync(password, salt);
            let newUser = User({
                username,
                password: hashPass,
                email,
                imageUrl,
                summary,
                jobTitle,
                company

            });
            newUser.save((err) => {
                res.redirect("/");
            });
        });
});

module.exports = router;