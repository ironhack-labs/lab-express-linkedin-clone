/*jshint esversion:6*/
const express        = require("express");
const authController = express.Router();

// User model
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

/* GET users listing. */
authController.get('/', function(req, res, next) {
  if(!req.session.currentUser){
    res.redirect('/login');
  }else{
    res.render('home', {
      username: req.body.name
    });
  }
});

authController.get("/signup", (req, res, next) => {
  res.render("signup");
});

authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name:username,
      email:email,
      password: hashPass,
      sumamary : '',
      imageUrl: '',
      company:'',
      jobTittle:''
    });

    newUser.save((err) => {
      if (err) {
        res.render("authController/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.send(`Name: ${username}, Email: ${email},
         Password: ${hashPass}, Summary: ${''}, ImageUrl: ${''}
         company: ${''}, jobTittle: ${''}`);
      }
    });
  });
});

module.exports = authController;
