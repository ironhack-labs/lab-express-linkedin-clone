
const express    = require("express");
const User       = require("../models/user");
const profileRoutes = express.Router();

profileRoutes.get("/show", (req, res, next) => {

    const data = {
        theUser: req.session.currentUser
    }

    res.render("profiles/show", data);
});

profileRoutes.get("/:id", (req, res, next) => {
    const id = req.params.id;
});

module.exports = profileRoutes;