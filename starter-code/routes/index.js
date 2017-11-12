var express = require('express');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const path = require('path');
const debug = require('debug')('basic-auth:'+ path.basename(__filename));

var router = express.Router();

const bcryptSalt     = 10;

/* GET home page. */
router.get('/', (req, res, next) => {
  const valor = {
    user: { $eq: req.query.name }
  };

  User.find(valor, (err, user) => {
    if (err) { return next(err); }

    res.render('authentication/home', {
      user: user,
      title: 'index'
    });
  });
});

router.get('/home', (req, res, next) => {
res.render('authentication/home', { title: 'home' });
});

router.get('/login', (req, res, next) => {
  res.render('authentication/login', { title: 'Login' });
});
router.get('/signup', (req, res, next) => {
res.render('authentication/signup', { title: 'signup' });
});


router.post('/signup', (req, res, next) => {

  let username = req.body.username;
  let password = req.body.password;

 if (username === "" || password === "") {
   res.render("authentication/signup", {
     errorMessage: "Indicate a username and a password to sign up"
   });
   return;
 }

 User.findOne({ "username": username }, "username", (err, user) => {
   if (user !== null) {
     res.render("authentication/signup", {
       title:"signup",
       errorMessage: "The username already exists"
     });

     return;
   }

   let salt = bcrypt.genSaltSync(bcryptSalt);
   let hashPass = bcrypt.hashSync(password, salt);

   const userInfo = {
     username,
     password: hashPass,
     name: req.body.name,
     email: req.body.email
   };
 // Crea instancia
 const newUser = new User(userInfo);

   newUser.save((err) => {
     if (err) {
       res.render("authentication/signup", {
         title:"signup",
         errorMessage: "Something went wrong when signing up"
       });
     } else {
       // User has been created...now what?
         return res.render('authentication/home',{
           title:"Home",
           username:username
         });
     }
   });
 });

});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
      res.render("authentication/login", {
        title: "login",
        errorMessage: "Indicate a username and a password to log in"
      });
      return;
    }

    User.findOne({ "username": username },
        "_id username password following",
        (err, user) => {
          if (err || !user) {
            res.render("authentication/login", {
              title: "Login",
              errorMessage: "The username doesn't exist"
            });
            return;
          } else {
            if (bcrypt.compareSync(password, user.password)) {
              req.session.currentUser = user;
              res.redirect("/home");
            } else {
              res.render("authentication/login", {
                title: "Login",
                errorMessage: "Incorrect password"
              });
            }
          }
      });
});

router.get('/logout', (req,res) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});
module.exports = router;
