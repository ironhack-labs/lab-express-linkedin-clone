const express = require('express');
const router = express.Router();
const path = require("path");
const debug = require('debug')(`starter-code:${path.basename(__filename).split('.')[0]}`);
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require("../models/User");

router.get("/signup",(req,res,next)=>{
    res.render("auth/signup",{title:"Signup"});
});

router.post("/signup", (req,res,next)=>{
    const {username,password}= req.body;

    if(username==="" || password===""){
        res.render("auth/signup"),{
            errorMessage:"Indicate a username and a password to signup"
        }
    }
    User.findOne({ "username": username }).exec()
      .then(user => {
        if (user) {
          res.render("auth/signup", {
            errorMessage: "The username already exists"
          });
        }
      })
      .then(() =>{
        // Hash the password
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
  
        const newUser = new User({
          username,
          password: hashPass
        });
  
        newUser.save()
          .then(() => {
            debug(`Se ha creado el usuario ${username}`);
            res.redirect("/")
          })
          .catch(e => next(e))
      });
  });router.get('/login', function(req, res, next) {
    res.render('auth/login');
});

router.get('/private', function(req, res, next) {
    if(req.session.currentUser){
        res.render('private', { title: 'Private' });
    }
    res.redirect('/auth/login');
});


router.post("/login", (req, res, next) => {
    const {username,password} = req.body;
  
    if (username === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Indicate a username and a password to sign up"
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
          debug(`${user.username} is now logged in`);
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  });

  router.get('/logout',(req,res) => {
    req.session.currentUser = null;
    res.redirect('/auth/login');
  })

module.exports = router;
