var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
 const username = req.body.username;
 const email = req.body.email;
 const password = req.body.password;
  if (username === "" || email === "" || password === ""){
      return res.render("auth/signup", {
      errorMessage: "Indicate email, user name &/or password"
    });
  }

  User.findOne({
    "username": username
  }, "username", (err, user) => {
    if (user !== null) {
      return res.render('signup', {
        errorMessage: "The username already exists"
      });
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

        const newUser = User({
       username: username,
       password: hashPass,
       email: email
     });

     newUser.save((err) => {
       if (err) {
         res.render("auth/signup", {
           errorMessage: "Something went wrong"
         });
       } else {
         console.log(`new user: ${username} created`);
         res.redirect("/");
       }
     });
   });

 });

 router.get('/login', function(req, res, next) {
     res.render('auth/login');
 });

 router.post('/login', function(req, res, next) {
   const username = req.body.username;
     const password = req.body.password;

     if (username === "" || password === "") {
       return res.render("auth/login", {
         errorMessage: "Indicate a username and a password to sign up"
       });
     }

     User.findOne({ "username": username }, (err, user) => {
     if(err){
       return res.render("auth/login", {
         errorMessage: err
       });
     }else{
       console.log(user);
       if(bcrypt.compareSync(password,user.password)){
         console.log("correct Password");
         req.session.currentUser = user;
         return res.redirect("/");
       }else{
         console.log("wrong Password");
         return res.render("auth/login", {
           errorMessage: "wrong password, try again"
         });
       }
     }

   });

 });

 router.get('/logout', function(req, res, next) {
   req.session.destroy((err) => {
     res.render("auth/login");
   });
   console.log(req.session);
 });

 module.exports = router;
