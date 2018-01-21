const User = require('../models/user.model');

module.exports.show = (req, res, next) => {
  const username = req.params.email;
  User.findOne({
      username: req.params.username
    })
    .then(user => {
      if (!user) {
        next();
      } else {
        res.render('profile/show');
      }
    })
    .catch(error => next(error));
};
