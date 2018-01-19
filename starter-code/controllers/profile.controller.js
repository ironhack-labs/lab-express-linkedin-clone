const User = require('../models/user.model');
const moment = require('moment');

module.exports.edit = (req, res, next) => {
  console.log("Email = " + req.params.email);
  const email = req.params.email;
  User.findOne({
      email: req.params.email
    })
    .then(user => {
      console.log(user);
      if (!user) {
        next();
      } else {
        res.render("profile/edit", user);
      }
    })
    .catch(error => next(error));
};
module.exports.update = (req, res, next) => {
  const user = new User({
    _id: req.session.currentUser._id,
    name: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  });
  User.findByIdAndUpdate(user._id, user, {
      new: true
    })
    .then(currentUser => {
      // req.session.currentUser = currentUser;
      res.send("ADIOS");
      // res.redirect(`/profile/${username}`);
    })
    .catch(error => next(error));
};