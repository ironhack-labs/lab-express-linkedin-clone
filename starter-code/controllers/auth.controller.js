const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
};

module.exports.doSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
      res.render('auth/signup', { 
          user: { email: email }, 
          error: {
              email: email ? '' : 'Email is required',
              password: password ? '' : 'Password is required'
          }
      });
  }else{   
      console.log("que");
      User.findOne({ email: email })
          .then(user => {
              errorData = {
                  error: { email: 'email already exists' }
              };
              console.log("hola");
              
              if (user != null) {
                  console.log("email already exists");            
                  res.render('auth/signup', errorData);
              } else {
                  user = new User(req.body);
                  user.save()
                  .then(() => {
                      console.log("User created");                      
                      res.send('/signok');
                      res.redirect('/signok');
                  }).catch(error => {
                      if (error instanceof mongoose.Error.ValidationError) {
                      res.render('auth/signup', { user: user, error: error.errors });                      } else {
                      next(error);
                      }
                  });
              }  
              })
          .catch(error => next(error));
  }
};