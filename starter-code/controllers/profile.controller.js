const User = require('../models/user.model');

module.exports.show = (req, res, next) => {
  res.render('profile/show',{session: req.session.currentUser});
};
