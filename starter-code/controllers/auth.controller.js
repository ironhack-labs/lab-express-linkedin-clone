const mongoose = require('mongoose');
const User = require('../models/user.model');


module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (user != null) {
              res.render('auth/signup', { user: user, error: { email: 'Username already exists'} });
          } else {
              user = new User(req.body);
              user.save()
                  .then(() => {
                      req.session.currentUser = user;
                      res.redirect('/profile/show');
                  }).catch(error => {
                      if (error instanceof mongoose.Error.ValidationError) {
                          res.render('auth/signup', { user: user, error: error.errors });
                      } else {
                          next(error);
                      }
                  });
          }
      }).catch(error => next(error));
};

module.exports.login = (req, res, next) => {
  res.render('auth/login');
};

module.exports.doLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
      res.render('auth/login', {
          user: { email: email },
          error: {
              email: email ? '' : 'Username is required',
              password: password ? '' : 'Password is required'
          }
      });
  } else {
      User.findOne({ email: email})
          .then(user => {
              errorData = {
                  user: { email: email },
                  error: { password: 'Invalid username or password' }
              };
              if (user) {
                  user.checkPassword(password)
                      .then(match => {
                          if (!match) {
                              res.render('auth/login', errorData);
                          } else {
                            console.log ("What up amelia");
                              req.session.currentUser = user;
                              res.redirect('profile/show');
                          }
                      })
                      .catch(error => { console.log("Error 1");
                      next(error);});
              } else {
                  res.render('auth/login', errorData);
              }
          }).catch(error => { console.log("Error 2");
          next(error);});
  }
};

module.exports.logout = (req, res, next) => {

};
