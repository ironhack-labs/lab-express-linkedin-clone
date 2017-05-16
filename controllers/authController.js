// ====================
// MIDDLEWARE
// ====================
const User = require('../models/user');

const authController = {};

authController.checkProfileOwnership = (req, res, next) => {
  // is logged in?
  if (req.session.currentUser) {
    User.findById(req.params.id, (err, foundProfile) => {
      if (err) {
        console.log('Error: ', err);
        // console.log('foundProfile', foundProfile);
        // console.log('req.user._id: ', req.user._id);
        console.log('req.session.currentUser: ', req.session.currentUser);
      } else if (foundProfile._id.equals(req.session.currentUser._id)) {
        next();
      } else {
        res.redirect('/profiles');
      }
    });
  } else {
    res.redirect('/login');
  }
};

authController.isLoggedIn = ((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});

module.exports = authController;
