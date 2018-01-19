const User = require('../models/user.model');
const moment = require('moment');

module.exports.edit = (req, res, next) => {
  if (req.params.email != req.session.currentUser.email) {
    res.redirect("/");
  } else {
    // console.log("Email = " + req.params.email);
    const email = req.params.email;
    User.findOne({
        email: req.params.email
      })
      .then(user => {
        // console.log(user);
        if (!user) {
          next();
        } else {
          res.render("profile/edit", user);
        }
      })
      .catch(error => next(error));
  }
};
module.exports.update = (req, res, next) => {
  if (req.body.email != req.session.currentUser.email) {
    res.redirect("/");
  } else {
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
        req.session.currentUser = user;
        res.redirect(`/profile/${req.session.currentUser.email}/edit`);
      })
      .catch(error => next(error));
  }
};

module.exports.show = (req, res, next) => {
  // console.log("ID = " + req.params.userId);
  const _id = req.params.userId;
  User.findOne({
      _id: _id
    })
    .then(user => {
      // console.log(user);
      if (!user) {
        next();
      } else {
        // console.log(req.session.currentUser);
        // console.log(user);
        res.render(`profile/show`, {
          user: user,
          sessionUser: req.session.currentUser
        });
      }
    })
    .catch(error => next(error));
};
