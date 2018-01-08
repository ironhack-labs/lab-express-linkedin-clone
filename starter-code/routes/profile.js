const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user").User;

router.get("/dashboard", (req, res, next) => {
  const currentUser = req.session.currentUser;
  const data = {
    user: currentUser
  };
  res.render("profile/dashboard", data);
});

module.exports = router;
