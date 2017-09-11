const express           = require("express");
const profileController = express.Router();

const User  = require("../models/User");

profileController.get("/:username", (req, res, next) => {
  User
    .findOne({ username: req.params.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return next(err); }
  });
});

profileController.get('/:id', (req, res, next) => {

  const userId = req.params.id;

  User.findById(userId, (err, User) => {
    if (err) { return next(err); }
    res.render('profile/show.ejs',{title: User, User: User});
  });
});

module.exports = profileController;
