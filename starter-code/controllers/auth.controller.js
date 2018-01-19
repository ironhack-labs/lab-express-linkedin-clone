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
      User.findOne({ email: email })
          .then(user => {
              errorData = {
                  error: { email: 'email already exists' }
              };
              if (user != null) {
                  console.log("email already exists");            
                  res.render('auth/signup', errorData);
              } else {
                  user = new User(req.body);
                  user.save()
                  .then(() => {
                      console.log("User created");  
                      console.log(user);  
                      req.session.currentUser = user;                    
                        res.render('auth/signok',user);
                      //   res.send('/signok');
                  }).catch(error => {
                      if (error instanceof mongoose.Error.ValidationError) {
                      res.render('auth/signup', { user: user, error: error.errors });                      
                    } else {
                      next(error);
                      }
                  });
              }  
              })
          .catch(error => next(error));
  }
};

module.exports.signok = (req, res, next) => {
    res.render('auth/signok');
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
                error: { password: 'Invalid email or password' }
            };
            if (user) {
                user.checkPassword(password)
                .then(match => {
                    if (!match) {
                        res.render('auth/login', errorData);
                    } else {
                        console.log("User log");  
                        console.log(user);  
                        req.session.currentUser = user;
                        // res.send('/tweets');
                        res.render('auth/signok',user);
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
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.redirect("/");
        }
    });
};