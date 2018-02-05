const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const User = require("../modules/user");

const bcryptSalt = 10;

// login form
router.get("/login", (req, res, next) => {
    if (req.session.currentUser){
        return res.redirect("/");
    }

    const data = {
        title: "Login"
    };
    res.render("authentication/login", data);
});

// post after login form
router.post("/login", (req, res, next) => {
    if (req.session.currentUser) {
        return res.redirect("/");        // this way?
    }

    let username = req.body.username;
    let password = req.body.password;

  if (username === '' || password === '') {
    const data = {
      title: 'Login',
      message: 'Indicate a username and a password to sign up'
    };
    return res.render('authentication/login', data);
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      return res.render('authentication/login', data);
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      const data = {
        title: 'Login',
        message: 'Username or password are incorrect'
      };
      res.render('authentication/login', data);
    }
  });
});

/* render the signup form. */
router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const data = {
    title: 'Signup'
  };
  res.render('authentication/signup', data);
});

/* handle the POST from the signup form. */
router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;
  const mail = req.body.mail;
  const name = req.body.name;

  // validate
  if (username === '' || password === '' || password.length < 8 || !password.match(/[A-Z]/)) {
    const data = {
      title: 'Signup',
      message: 'Try again'
    };
    return res.render('authentication/signup', data);
  }

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('/signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      name,
      mail
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = newUser;
      res.redirect('/');
    });
  });
});

module.exports = router;