const express = require("express");
const authController = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authController.get("/", (req, res) => {
    res.redirect("/login");
});

authController.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
    let username = req.body.username;
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({ "username": username }, "username", (err, user) => {
        if (user !== null) {
            res.render("auth/signup", {
                errorMessage: "The username already exists"
            });
            return;
        }

        let salt = bcrypt.genSaltSync(bcryptSalt);
        let hashPass = bcrypt.hashSync(password, salt);

        let newUser = User({
            username,
            name,
            password: hashPass,
            email
        });

        newUser.save((err) => {
            if (err) {
              res.render("auth/signup", {
                errorMessage: "Something went wrong when signing up"
              });
            } else {
              res.redirect("/login");
            }
        });
    });
});

authController.get("/login", (req, res, next) => {
    res.render("auth/login");
});

authController.post("/login", (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(req);
    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indicate a username and a password to log in"
        });
        return;
    }

    User.findOne({ "username": username },
        "_id username password following",
        (err, user) => {
            if (err || !user) {
                res.render("auth/login", {
                    errorMessage: "The username doesn't exist"
                });
                return;
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.currentUser = user;
                        res.redirect("/");
                  } else {
                    res.render("auth/login", {
                      errorMessage: "Incorrect password"
                    });
                }
            }
        });
});

module.exports = authController;