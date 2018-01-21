const mongoose = require('mongoose');
const User = require('../models/user.model');


module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
}

module.exports.doSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (user != null) {
              res.render('auth/signup', { user: user, error: { email: 'User already exists'} })
          } else {
              user = new User(req.body);
              user.save()
                  .then(() => {
                      req.session.currentUser = user;
                      res.redirect('/profile');
                  }).catch(error => {
                      if (error instanceof mongoose.Error.ValidationError) {
                          res.render('auth/signup', { user: user, error: error.errors })
                      } else {
                          next(error);
                      } // doubt: not sure I understand this 
                  });
          }
      }).catch(error => next(error));
}

module.exports.login = (req, res, next) => {

}

module.exports.doLogin = (req, res, next) => {

}

module.exports.logout = (req, res, next) => {

}
