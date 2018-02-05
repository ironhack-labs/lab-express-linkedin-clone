const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/User');

router.get('/signup', (req, res) => {
    res.render('auth/signup', { title: "Home Page" });
  });

  router.post('/signup', (req, res, next) => {
        // const { username, password } = req.body;
    
        const name = req.body.name
        const password = req.body.password
        
       
      if (name === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        
        });
        return;
      }
    
      User.findOne({ "username": name }).exec()
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
          name,
          password: hashPass
        });
    
        newUser.save()
          .then(() => {
            console.log(`Se ha creado el usuario ${name}`);
            res.redirect("/")
          })
          .catch(e => next(e))
      });
    });

    router.get('/login', (req, res, next) => {
      res.render('auth/login', { title: "Log-in" });
    });
    
    router.post("/login", (req, res, next) => {
      const {name,password} = req.body;
    
      if (name === "" || password === "") {
        res.render("auth/login", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
    
      User.findOne({ "name": name }, (err, user) => {
          if (err || !user) {
            res.render("auth/login", {
              errorMessage: "The username doesn't exist"
            });
            return;
          }
          
          if (bcrypt.compareSync(password, User.password)) {
            // Save the login in the session!
            req.session.currentUser = User;
            debug(`${User.name} is now logged in`);
            res.redirect("/");
          } else {
            res.render("auth/login", {
              errorMessage: "Incorrect password"
            });
          }
      });
    });
    
    
    // router.get('/logout',(req,res) => {
    //   req.session.currentUser = null;
    //   res.redirect('/');
    // })                                       ---- no consigo que me funcione
    
  module.exports = router;