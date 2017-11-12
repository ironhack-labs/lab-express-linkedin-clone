const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const debug = require('debug')('basic-auth:'+ path.basename(__filename));
const router = express.Router();
const bcryptSalt = 5;

router.get('/', (req, res) => {
  res.render('home', { title: 'LinkedIn' });
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'LinkedIn' });
});

router.get('/signup', (req, res) => {
  res.render('authentication/signup', { title: 'Signup' });
});

router.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const summary = req.body.summary;
  const imageUrl = req.body.imageUrl;
  const company = req.body.company;
  const jobTitle = req.body.jobTitle;

  // Server-sided form security
  if (email === "" || password === ""){
    res.render("authentication/signup", {
      errorMessage: "Missing email or password"
    });
  }

  // Look for user email before signing up
  User.findOne({ "email": email },
    "email",
    (err, user) => {
      if (user !== null) {
        res.render("authentication/signup", {
          errorMessage: "Sorry, that email is already in use.."
        });
        return;
      }

      // Password encryption
      var salt = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

      // User creation
      var newUser = User({
        name,
        email,
        password: hashPass,
        summary,
        imageUrl,
        company,
        jobTitle
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
});

router.get('/login', (req, res) => {
  res.render('authentication/login', { title: 'Login' });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate an email and a password to login"
    });
    return;
  }

  User.findOne({ "email": email }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "That specific email does not exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/profile");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

// Edit user profile

router.get('/:id', (req, res, next) => {
  let id = req.params.id

  User.findById(id, (err, user) => {
    res.render('/profile', {
      user: user
    })
  })
});

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id

  User.findById(id, (err, user) => {
    res.render('profile/:id', {
      user: user
    })
  })
});

router.post('/:id', (req, res, next) => {
  let id = req.params.id

  const updates = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    summary: req.body.password,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    password: req.body.password,
  };

  User.findByIdAndUpdate(id, updates, (err, user) => {
    if (err){ return next(err); }

    return res.redirect(`/profile/${user._id}`);
  });
});

router.get('/logout', (req,res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});


module.exports = router;
