const express = require("express");
const authController = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
	var email = req.body.email;
  var password = req.body.password;
	var summary = req.body.summary;
	var imageURL = req.body.imageURL;
	var company = req.body.company;
	var jobTitle = req.body.jobTitle;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up and an email address to sign up"
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

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
			email,
      password: hashPass,
			summary,
			imageURL,
			company,
			jobTitle,
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
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username email password summary imageURL company jobTitle following",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;

					let data = {
						user : req.session.currentUser
					}

					res.render("home",data);
          // logged in
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

authController.get("/logout", (req, res) => {
    req.session.destroy(function(err) {
        // cannot access session here
        res.redirect("/login");
    });
});

module.exports = authController;
