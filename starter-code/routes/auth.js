const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const bcryptSalt = 10;
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signup', function(req, res, next) {
  console.log('HOLA, ENTRO EN SIGNUP');
  res.render('auth/signup', {
    title: 'Signup Linkedin'
  });
});

router.post('/signup', function(req, res, next) {
  console.log(req.body);
  if (req.body.email === "" || req.body.password === "" || req.body.name === "") {
    return res.render('auth/signup', {
      title: 'Signup Linkedin',
      errorMessage: "Indicate a email and a password to sign up"
    });
  }

  User.findOne({
    "email": req.body.email
  }, "email", (err, user) => {
    if (user !== null) {
      return res.render('auth/signup', {
        title: 'Signup Linkedin',
        errorMessage: "The email already exists"
      });
    }
    console.log(req.body);
    let email    = req.body.email;
    let name     = req.body.name;
    let password = req.body.password;
    let salt     = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      name: name,
      email: email,
      password: hashPass,
      summary: "",
      imageUrl: "",
      company: "",
      jobTitle: "",
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", {
          title: 'Signup Linkedin',
          errorMessage: "Something was wrong"
        });
      } else {
        console.log("YEAHH USUARIO REGISTRADO");
        res.redirect("/");
      }
    });
  });
});

router.get('/login', function(req, res, next) {
  //  If user is logged
  // => Redirect to the home page
  //  Else
  // => Show log in page
  console.log('HOLA, ENTRO EN LOGIN');
  user = req.session.currentUser;

  console.log(user);
  if (user !== undefined) {
    res.redirect("/");
    } else {
    res.render('auth/login', {
      title: 'Linkedin login'
    });
  }
});

router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    return res.render("auth/login", {
      title: "Linkedin login",
      errorMessage: "Indicate a username and a password to sign up"
    });
  }
  User.findOne({
    "username": username
  }, (err, user) => {
    if (user === null) {
      return res.render("auth/login", {
        title: "Linkedin login",
        errorMessage: "Godzilla has reached this user a long time ago. - User dont exist"
      });
    }
    if (err) {
      return res.render("auth/login", {
        title: "Linkedin login",
        errorMessage: err
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        console.log(req.session.currentUser);
        req.session.currentUser = user;
        console.log("YEAHHH ME LOGUEO");
        console.log(req.session.currentUser);
        return res.redirect("/auth/login");
      } else {
        return res.render("auth/login", {
          title: "Linkedin login",
          errorMessage: "Kiyo, the pass is incorect"
        });
      }
    }
  });
});

router.get('/logout', function(req, res, next) {
  console.log('HOLA, ENTRO EN LOGOUT');
  // End user session
  res.render('home', {
    title: 'Express'
  });
});
module.exports = router;
