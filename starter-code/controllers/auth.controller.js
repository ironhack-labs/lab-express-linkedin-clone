const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.index = (req, res, next) => {
    if(req.session.currentUser) {
        console.log('index_logged');
        res.send(req.session);
    }
    else {
        console.log('index_no_logged');
        res.redirect('/login');
    }
    
}

module.exports.signup = (req, res, next) => {
    res.render("auth/signup");
}

module.exports.login = (req, res, next) => {
    res.render('auth/login', {
        flash: req.flash()
    });
}

module.exports.logout = (req, res, next) => {
    req.logout();
    res.redirect("/login");
}

module.exports.doSignup = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if(user != null) {
                console.log(user);
                res.render('auth/signup', {
                    user: req.body,
                    error: { email: 'Username already registered'}
                });
            }
            else {
                user = new User(req.body);
                user.save()
                    .then(() => {
                        res.render('auth/login', {
                            user: user
                        });
                    })
                    .catch((error) => {
                        if(error instanceof mongoose.Error) {
                            res.render('auth/signup', {
                                email: user.email,
                                error: error.errors
                            });
                        }
                        else {
                            next(error);
                        }
                    })
            }
        })
        .catch(error => {
            next(error);
        })
}

module.exports.doLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password) {
        res.render('auth/login', {
            user: { email: email },
            error: {
                email: email ? '' : 'Username is required',
                password: password ? '' : 'Password is required'
            }
        });
    }
    else {
        passport.authenticate('local-auth', (error, user, validation) => {
            if(error) {
                console.log('error1');
                next(error);
            }
            else if(!user) {
                console.log('no user');
                res.render('auth/login', { error: validation });
            }
            else {
                req.login(user, (error) => {
                    if(error) {
                        console.log('error2');
                        next(error);
                    }
                    else {
                        console.log('redirect');
                        res.render('auth/home', {user: user});
                    }
                })
            }
        })(req, res, next);
    }
}