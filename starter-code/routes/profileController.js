const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/User");


// Moment to format dates
const moment = require("moment");

profileController.get("/:username", (req, res, next) => {
  User
    .findOne({ username: req.params.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return next(err); }  
      });
  });
