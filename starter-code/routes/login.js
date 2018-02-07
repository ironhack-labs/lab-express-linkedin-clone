const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');

router.get("/", (req, res, next) => {
    res.render("login");
});

router.post("/", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


module.exports = router;