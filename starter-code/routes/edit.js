const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* cuando el user va a la página de signup... */
router.get('/edit', function (req, res, next) {
    res.render('edit', {
        title: 'Express'
    });
});

/* CUANDO EL USER RELLENA EL FORM DE EDIT PROFILE */
router.post("/edit", (req, res, next) => {
    const {username} = req.body;
    const {password} = req.body;
    const {name} = req.body;
    const {email} = req.body;
    const {summary} = req.body;
    const {imgURL} = req.body;
    const {company} = req.body;
    const {jobTitle} = req.body;

    if (username === "" || password === "" || name === "" || email === "" ) {
        res.render("edit", {
            message: "Please make sure you´ve filled all the info"
        });
        return;
    }

    User.findOne({username}, "username", (err, user) => {
        if (user !== null) {
            res.render("edit", {
                message: "Sorry, that username is already taken."
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass,
            name,
            email,
            summary,
            imgURL,
            company,
            jobTitle,
        });
        newUser.save((err) => {
            if (err) {
                res.render("/edit", {
                    message: "Oops, something went wrong..."
                });
            } else {
                res.redirect("/index");
            }
        });
    });
});
module.exports = router;