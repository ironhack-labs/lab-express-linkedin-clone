
const express = require("express");
const authRoutes = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/signup", (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect('/');
    }
    
    res.render("auth/signup");
});

authRoutes.get("/login", (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect('/');
    }
    
    res.render("auth/login");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const name     = req.body.name;
    const email    = req.body.email;
    const password = req.body.password;
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
  
    const newUser  = User({
      name,
      email,
      username,
      password: hashPass
    });

    if (req.session.currentUser) {
        return res.redirect('/');
    }
    

    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }
    User.findOne({ "username": username },(err, user) => {
        if (user !== null) {
            res.render("auth/signup", {
            errorMessage: "The username already exists"
        });
            return;
        }

        var salt     = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);
        var newUser = User({
        username,
        password: hashPass
        });

    newUser.save((err) => {
      res.redirect("/");
    });
  });
  });

authRoutes.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        // cannot access session here
    res.redirect("/login");
    });
});

authRoutes.post("/login", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    if (req.session.currentUser) {
        return res.redirect('/');
    }
    

    if (username === "" || password === "") {
        res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
            res.render("auth/login", {
            errorMessage: "The username doesn't exist"
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/home");
        } else {
            res.render("auth/login", {
            errorMessage: "Incorrect password"
            });
        }
    });
});

module.exports = authRoutes;