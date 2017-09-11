const express = require('express');
const router = express.Router();
const User = require("../../models/user")
const Post = require("../../models/post")
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


router.get('/home', (req, res, next) => {
  if (req.session.currentUser) {
      Post.find({"_creator": req.session.currentUser._Id}, (err, posts) => {
      if (err) { return next(err) } 
        res.render('home', {posts: posts})
    })
    
  } else {
    res.render('authentication/signup');
  }
});

/* GET sign-up page. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('home');
  } else {
    res.render('authentication/signup');
  }
});

/* POST sign-up page */
router.post('/signup', (req, res, next) => {

  var salt     = bcrypt.genSaltSync(bcryptSalt);

  const newUser =  User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
    name: req.body.name,
    email: req.body.email,
  });

  if (newUser.username === "" || newUser.password === "" || newUser.name === "" || newUser.email === "") {
    res.render("authentication/signup", {
      errorMessage: "DrinkedIn requires all fields complete to sign up"
    });
    return;
  }

  User.findOne({ "username": newUser.username }, "username", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "That DrinkedIn username already exists"
      });
      return;
    }

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        req.session.currentUser = newUser;
        res.render('home', { newUser });
      }
    });
  });
});


/* GET log-in page */

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('home')
  } else {
    res.render('authentication/login');
  }
});



/* POST log-in page */

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
      res.render("authentication/login", {
        errorMessage: "Please give a username and a password to log in"
      });
      return;
    }

    User.findOne({ "username": username },
    "_id username password name following",
    (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "That DrinkedIn username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render("home", {newUser: user} );
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

/* GET log-out page */

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/authentication/login");
  })
});

module.exports = router;