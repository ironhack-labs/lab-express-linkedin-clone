const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'login'
  });
});

router.post("/login/profile", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        console.log("estoy log");
        req.session.currentUser = user;
        console.log(user);
        res.render("basichome" , {user:user});
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    console.log("deslogeo");
    // cannot access session here
    res.redirect("/login");
  });
});

router.get('/login/:id', (req,res, next) => {
  User.findById(req.params.id)
    .then(result => res.render('editProfile', {user:result}))
    .reject (err => console.log(err));
});

router.post('/login/:id', (req, res, next) => {
  const update = {
    name:req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
  };
  User.findByIdAndUpdate(req.params.id , update)
    .then(result => res.redirect('basichome', {user:user}))
    .catch(err => console.log ("Error al actualizar"));
});

module.exports = router;
