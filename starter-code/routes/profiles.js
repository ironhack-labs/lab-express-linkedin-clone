
const express    = require("express");
const User       = require("../models/user");
const profileRoutes = express.Router();

profileRoutes.get("/show", (req, res, next) => {
    res.render("profiles/show");
});

module.exports = profileRoutes;