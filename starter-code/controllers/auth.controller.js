const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.index = (req, res, next) => {
    if(req.session.currentUser){
        res.render('index', {user: req.session.currentUser});
    }else{
        res.render('auth/login');
    }
    
}

module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
}

module.exports.doSignup = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user != null) {
                res.render('auth/signup', { user: user, error: { username: 'Username already exists'} })
            } else {
                user = new User(req.body);
                user.save()
                    .then(() => {
                        req.session.currentUser = user;
                        res.redirect('/');
                    }).catch(error => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('auth/signup', { user: user, error: error.errors })
                        } else {
                            next(error);
                        }
                    });
            }  
        }).catch(error => next(error));
}

module.exports.login = (req, res, next) => {
    console.log(req.session.currentUser);
    res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.render('auth/login', { 
            user: { username: username }, 
            error: {
                username: username ? '' : 'Username is required',
                password: password ? '' : 'Password is required',
                email: email ? '' : 'Email is required'
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
                                req.session.authenticated = true;
                                req.session.currentUser = user;
                                res.redirect('/');
                            }
                        })
                        .catch(error => next(error));
                } else {
                    res.render('auth/login', errorData);
                }
            }).catch(error => next(error));
    }

}

module.exports.logout = (req, res, next) => {
    console.log(req.session);
    if (req.session.authenticated) {
    req.session.destroy(function(err) {
        // cannot access session here
    console.log(err);
    
    });
    }else{
        console.log("ASDF");
    }
}