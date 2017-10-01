const express = require('express');
const bcrypt= require('bcrypt');
const authController = express.Router();

const User = require('../models/user');
const bcryptSalt = 10;

authController.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

authController.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    
    if (username === "" || password === "" || name === "" || email === "") {
        res.render("auth/signup", {
            errorMessage: "Please, fill all the form "
        })
        return;
    }
    
    User.findOne({ "username": username },
    "username",
    (err, user) => {
        if (user !== null) {
            res.render("auth/signup", {
                errorMessage: "The username already exist !"
            })
            return;
        }

        var salt = bcrypt.genSaltSync(bcryptSalt)
        var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
        username: username,
        password: hashPass,
        name: name,
        email: email

    })

    newUser.save(err => {
        if (err) {
             res.render("auth/signup", {
               errorMessage: "Oups something went wrong !"
             });
        } else {
            res.render('auth/signup', {
                successMessage: "User created !"
            })
        }
    })

    })

})

authController.get('/login', (req, res, next) => {
    res.render('auth/login')
})

authController.post("/login", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        res.render('auth/login', {
            errorMessage: "Indicate a username and a password to sign up"
        })
        return;
    }

    User.findOne({'username': username}, (err, user) => {
        if (err || !user) {
            res.render('auth/login', {
                errorMessage: "The username doesn't exist"
            })
            return
        }
        if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/home');
        } else {
            res.render('auth/login', {
                errorMessage: 'Incorrect password'
            })
        }
    })
})

authController.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/login')
    })
})

module.exports = authController;