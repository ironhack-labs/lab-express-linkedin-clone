const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/User");


profileController.get("/:username", (req, res, next) => {
  User
    .findOne({ username: req.params.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return next(err); }
      });
  });
