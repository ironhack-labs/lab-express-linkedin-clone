
const express    = require("express");
const User       = require("../models/user");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
    res.render("index");
});

siteRoutes.get("/show", (req, res, next) => {
    res.render("profiles/show");
});

siteRoutes.get("/home", (req, res, next) => {

    if (!req.session.currentUser) {
        return res.redirect('/');
    }

    res.render("home");
});

siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    }else {
        res.redirect("/login");
    }
  });

module.exports = siteRoutes;

