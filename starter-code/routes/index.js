const express = require("express");
const authRoutes = express.Router();


authRoutes.get("/", (req, res, next) => {
  if (req.session.currentUser) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});


module.exports = authRoutes;
