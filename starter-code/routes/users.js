const express = require('express');
const User = require('../models/user');

const authRouter = express.Router();

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* GET users listing. */
authRouter.get('/signup', function(req, res, next) {
  res.render('/auth/signup');
});


// authRouter.post("/signup", (req, res, next) => {
//   var username = req.body.username;
//   var password = req.body.password;

//   if (username === "" || password === "") {
//     res.render("auth/signup", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }

//   User.findOne({ "username": username }, "username", (err, user) => {
//     if (user !== null) {
//       res.render("auth/signup", {
//         errorMessage: "The username already exists"
//       });
//       return;
//     }

//     var salt     = bcrypt.genSaltSync(bcryptSalt);
//     var hashPass = bcrypt.hashSync(password, salt);

//     var newUser = User({
//       username,
//       password: hashPass
//     });

//     newUser.save((err) => {
//       if (err) {
//         res.render("auth/signup", {
//           errorMessage: "Something went wrong when signing up"
//         });
//       } else {
//         // User has been created...now what?
//       }
//     });
//   });
// });


module.exports = authRouter;
