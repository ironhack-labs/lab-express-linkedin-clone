const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  console.log(req.body);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let password = req.body.password;
  let username = req.body.username;
  let email = req.body.email;
  let summary = req.body.summary;
  let company = req.body.company;
  let jobTitle = req.body.jobTitle;
  let imageUrl = req.body.imageUrl;

  let salt     = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("register", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  } else {
    User.findOne({username}, "username", (error, user) => {
      if (error) {
        throw error;
      } else if(user !== null) {
        console.log("please select a different username");
      } else {
        let newUser = User({
          firstName,
          lastName,
          email,
          password: hashPass,
          username,
          summary,
          imageUrl,
          company,
          jobTitle
        });
        newUser.save((error) => {
          res.render("index");
        });
      }
    }
  );
  }
});


module.exports = router;
