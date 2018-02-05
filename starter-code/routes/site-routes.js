
const express    = require("express");
const User       = require("../models/user");
const siteRoutes = express.Router();

siteRoutes.get("/", (req, res, next) => {
    res.render("index");
});

siteRoutes.get("/home", (req, res, next) => {

    const data = {
        theUser: req.session.currentUser
    }

    if (!req.session.currentUser) {
        return res.redirect('/');
    }

    res.render("home", data);
});

siteRoutes.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    }else {
        res.redirect("/login");
    }
  });

module.exports = siteRoutes;

