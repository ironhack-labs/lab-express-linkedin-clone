const mongoose = require('mongoose');
const User = require('../models/user.model');


module.exports.signup = (req, res, next) => {
  res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
          if (user != null) {
              res.render('auth/signup', { user: user, error: { email: 'Username already exists'} })
          } else {
              user = new User(req.body);
              user.save()
                  .then(() => {
                      req.session.currentUser = user;
                      res.redirect('/profile/show');
                  }).catch(error => {
                      if (error instanceof mongoose.Error.ValidationError) {
                          res.render('auth/signup', { user: user, error: error.errors })
                      } else {
                          next(error);
                      }
                  });
          }
      }).catch(error => next(error));
};

module.exports.login = (req, res, next) => {
  console.log(req.session.currentUser);
  res.render('auth/login');
};

module.exports.doLogin = (req, res, next) => {
  const username = req.body.email;
  const password = req.body.password;
  if (!username || !password) {
      res.render('auth/login', {
          user: { username: email }, 
          error: {
              username: username ? '' : 'Username is required',
              password: password ? '' : 'Password is required'
          }
      });
  } else {
      User.findOne({ username: username})
          .then(user => {
              errorData = {
                  user: { username: username },
                  error: { password: 'Invalid username or password' }
              }
              if (user) {
                  user.checkPassword(password)
                      .then(match => {
                          if (!match) {
                              res.render('auth/login', errorData);
                          } else {
                              req.session.currentUser = user;
                              res.redirect('/tweets');
                          }
                      })
                      .catch(error => next(error));
              } else {
                  res.render('auth/login', errorData);
              }
          }).catch(error => next(error));
  }
};

module.exports.logout = (req, res, next) => {

};
