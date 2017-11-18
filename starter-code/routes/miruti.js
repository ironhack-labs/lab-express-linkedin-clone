const express          = require("express");
const miruti = express.Router();
const User  = require("../models/user");
const Post = require("../models/post");

miruti.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

miruti.get("/posts", (req, res, next) => {
  res.render("profiles/seeProfiles",
    { user: req.session.currentUser });
});


module.exports = miruti;
