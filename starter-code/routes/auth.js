/*jshint esversion: 6 */

const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const router = express.Router();


router.get('/signup', function(req, res, next) {
  res.render('signup', withTitle({}, 'SignupFormulario'));
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  if (req.body.username === "" || req.body.password === "") {
    return res.render('signup',
      withTitle({
        errorMessage: "Indicate a username and a password to sign up"
      }));
  }

  User.findOne({
    "username": req.body.username
  }, "username", (err, user) => {
    if (user !== null) {
      console.log("EL usuario existe");
      return res.render('signup',
      withTitle({
        errorMessage: "The username already exists"
      }));
    }
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username:req.body.username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", withTitle({
          errorMessage: "Something went wrong"
        }));
      } else {
        console.log("OK");
        res.redirect("/");
      }
    });
  });
});


/* GET auth route login form */
router.get('/login', function(req, res, next) {
  res.render('login', withTitle({}, 'Login Formulario'));
});

/* GET auth route login form */
router.post('/login', function(req, res, next) {
  console.log(req.body);

  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    return res.render("login", withTitle({
      errorMessage: "Indicate a username and a password to sign up"
    },'Login Formulario'));
  }

  User.findOne({ "username": username }, (err, user) => {
    if(err){
      return res.render("login", withTitle({
        errorMessage: err
      },'Login Formulario'));
    }else{
      console.log(user);
      if(bcrypt.compareSync(password,user.password)){
        // BIEN! El password es correcto
        console.log("Password correcto");
        req.session.currentUser = user;
        return res.redirect("/");
      }else{
        console.log("Password incorrecto");
        return res.render("login", withTitle({
          errorMessage: "Pon bien el password"
        },'Login Formulario'));
      }
    }

  });

});


router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});


module.exports = router;
