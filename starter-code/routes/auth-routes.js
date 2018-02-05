const express = require('express');
const authRoutes = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


//-------------LOGIN
authRoutes.get('/login', (req, res, next)=>{  
  res.render('auth/login');
})


authRoutes.post('/login', (req, res, next)=>{

  //Form validation
  if (req.body.username === "" || req.body.password === "") {
    res.render("auth/login", {
      errorMessage: "Please fill out all the fields"
    });
    return;
  };

  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const userInfo = {
    username : req.body.username,
    password : hashPass
  };

  User.findOne({'username' : userInfo.username}, (err, user)=>{
    //Check is user exists
    if(err || !user){
      res.redirect('auth/login', {
        errorMessage : 'This user doesn\'t exist!'
      });
      return;
    }
    //Check if the password matches
    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;
      // console.log('Session user: ', req.session.currentUser)
      res.redirect('/');
    } else {
      res.render('auth/login', {
        errorMessage : 'Invalid password'
      });
    }
  });  
});

//-----------------SIGNUP
authRoutes.get('/signup', (req, res, next)=>{
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next)=>{
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const userInfo = {
    name : req.body.name,
    username : req.body.username,
    email : req.body.email,
    password : hashPass
  };

  //Form validation
  if (userInfo.name === "" || userInfo.email === "" || userInfo.username === "" || userInfo.password === "") {
    res.render("auth/signup", {
      errorMessage: "Please fill out all the fields"
    });
    return;
  }

  //Checking if the user exists
  User.findOne({'username' : userInfo.username}, 'username', (err, user)=>{
    if(user!=null){
      res.render('auth/signup', {
        errorMessage : 'The username is already taken!'
      });
      return;
    } 
  });

  const newUser = new User(userInfo);

  newUser.save((err)=>{
    if(err){
      res.render('auth/signup', {
        errorMessage : 'Something went wrong at DB level...'
      });
    } else {
      res.redirect('/signup');
    }    
  });
});

authRoutes.get('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});

module.exports = authRoutes;