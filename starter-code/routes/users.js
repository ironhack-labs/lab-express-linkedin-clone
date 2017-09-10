const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  if (username === "" || password === "" || name ==="" | email ==="") {
    res.render("signup", {
      errorMessage: "Fill all the fields to sign up"
    });
    return;
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        username: username,
        password: hashPass,
        name: name,
        email: email
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });
});







module.exports = router;
