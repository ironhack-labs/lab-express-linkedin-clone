const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/User')
const bcryptSalt = 10

////USBAT => Register in the application:
//Print form
router.get('/signup', (req, res) => {
  if (req.session.currentUser) {
    res.render('index',{
      user: req.session.currentUser.name
    })
  } else {
      res.render('auth/signup', {
        title: 'Login Here!'
      })
    }
})

//Create user in database:
router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
  .then(user =>{
    if(user){
      res.render("auth/signup", {
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


// USBAT => Login
router.get('/login', (req, res) => {
  if (req.session.currentUser) {
    res.render('index',{
      user: req.session.currentUser.name
    })
  } else {
  res.render('auth/login', {
    title: 'Login Here!'}
  )}
})

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Invalid user name."
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = router;
