const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


router.get('/singup', (req, res, next) => {
  res.render('singup', {
    title: 'Signup'
  });
});

router.post('/singup', (req, res, next) => {
  console.log('entra');

  const userName = req.body.username;
  const password = req.body.password;

  if (userName === "" || password === "") {
    res.render("singup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": userName }).then(user =>{
    if(user){
      res.render("singup", {
        errorMessage: "User already exists"
      });
      return;
    }
    });
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    console.log(userName);

  const newUser = new User({
    username: userName,
    password: hashPass,
    name:req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
  });
  console.log(newUser);

  newUser.save()
    .then(result => res.render('index.ejs'))
    .catch(err => console.log ("Error al crear user"));
});

module.exports = router;
