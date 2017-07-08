const express = require("express");
const authController = express.Router();
const User = require("../models/User");  // User model
const bcrypt = require("bcrypt"); // Bcrypt to encrypt passwords
const bcryptSalt = 10;

// Show the form
authController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// info from the form
authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var jobTitle = req.body.jobTitle;
  var company = req.body.company;

  console.log(req.body);

  // Validations Model required fields
  if (username === "") {
    res.render("auth/signup", {
      errorMessage: "You must type an USERNAME to sign up"
    });
    return;
  }
  if (password === "") {
    res.render("auth/signup", {
      errorMessage: "You must type a PASSWORD to sign up"
    });
    return;
  }
  if (email === "") {
    res.render("auth/signup", {
      errorMessage: "You must type an EMAIL to sign up"
    });
    return;
  }
  if (company === "") {
    res.render("auth/signup", {
      errorMessage: "You must type a COMPANY to sign up"
    });
    return;
  }
  if (jobTitle === "") {
    res.render("auth/signup", {
      errorMessage: "You must type a JOB to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists",
        user: newUser
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: username,
      password: hashPass,
      email: email,
      summary: summary,
      imageUrl: imageUrl,
      company: company,
      jobTitle: jobTitle
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
        res.render("auth/signup", {
          successMessage: "User created!!!!"
        });
      }
    });
  });
});

// Show the LOGIN form
authController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// info from the form
authController.post("/login", (req, res, next) => {

  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "_id username password", (err, user) => {
    if(err || !user){
       res.render("auth/login",{errorMessage : "The username doesn't exist"
     });
     return;
    }else{
      if(bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user;
        return res.redirect("/");
      }else{
        res.render("auth/login",{
          errorMessage: "Wrong Password"
        });
      }
    }

    });
});


// LOGOUT
authController.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});





module.exports = authController;
