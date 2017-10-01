const express = require('express');
const auth = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// HOME PAGE
// when the user lands on the /index or / page, show them the view at routes/index. if they are still logged in from their session, take them to their profile page
auth.get('/', (req, res, next) => {
  if(req.session.currentUser) {
    res.render('auth/welcome'
    ,{ username: req.session.currentUser.username,
       name: req.session.currentUser.name,
       image: req.session.currentUser.image,
        job: req.session.currentUser.job,
      company: req.session.currentUser.company,
      summary: req.session.currentUser.summary,
      id: req.session.currentUser.id}
  );
  } else {
    res.render('index');
  }
});

// SIGN UP PAGE
// when the user lands on the /signup page, show them the view at auth/signup. if they are still logged in from their session, take them to their profile page
auth.get('/signup', (req, res, next) => {
  if(req.session.currentUser) {
    res.render('auth/welcome'
    ,{ username: req.session.currentUser.username,
       name: req.session.currentUser.name,
       image: req.session.currentUser.image,
        job: req.session.currentUser.job,
      company: req.session.currentUser.company,
      summary: req.session.currentUser.summary,
      id: req.session.currentUser.id}
  );
  } else {
    res.render('auth/signup');
  }
});

// SIGN UP SUBMIT SIGN UP INFORMATION
// when the user fills in the sign up details and clicks submit, get the data, verify it, and if it's ok write it to the db
auth.post('/signup',(req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;

//check the fields aren't empty
  if(username === "" || password === "" || name ==="" || email ===""){
    res.render('auth/signup', {
      errorMessage: "You need to enter all the details to sign up"
    });
    return;
  }
// check that the username doesn't exist already
  User.findOne({"username": username}, "username", (err, user) => { // is the "username" projection needed?

    if(user !== null){
      res.render('auth/signup', {
        errorMessage: "That username is taken, try another"
      });
      return;
    }
// if the username is available, encrypt the password...
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);
// create a new user
    let newUser = User({ // links back to the schema
      username: username,
      password: hashPass,
      name: name,
      email: email
    });
// save new user to the db
    newUser.save((err) =>{
      if(err){
        res.render("auth/signup", {
          errorMessage: "Uh oh, there was a problem signing up. Try again"
        });
      } else {
    //if their signup is successful, they land on the login page to login
        res.redirect('/login');
      }
    });
  });
});

// USER LOGIN PAGE
// when the user lands on the /login page, show them the view at auth/login. if they are still logged in from their session, take them to their profile page
auth.get('/login', (req, res, next) => {
  if(req.session.currentUser) {
    res.render('auth/welcome'
    ,{ username: req.session.currentUser.username,
        name: req.session.currentUser.name,
        image: req.session.currentUser.image,
         job: req.session.currentUser.job,
       company: req.session.currentUser.company,
       summary: req.session.currentUser.summary,
       id: req.session.currentUser.id}
  );} else {
    res.render('auth/login');
  }
});

// LOG IN PAGE, SUBMIT USER LOG IN CREDENTIALS
auth.post('/login',(req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
// check fields aren't empty
  if(username === "" || password === ""){
    res.render('auth/login', {
      errorMessage: "You need to enter your username AND your password"
    });
    return;
  }
// check log in username exists in the db
  User.findOne({"username": username},(err, user) =>{
    if(err||!user){
      res.render('auth/login', {
        errorMessage: "Hmm...this user doesn't exist. Check your username and try again"
      });
      return;
    }
    // if the usernam exists, encrypts password and checks this against stored password
    if(bcrypt.compareSync(password, user.password)){
      // store the session
      req.session.currentUser = user;

      res.render('auth/welcome'
      ,{ username: req.session.currentUser.username,
       name: req.session.currentUser.name,
       image: req.session.currentUser.image,
        job: req.session.currentUser.job,
      company: req.session.currentUser.company,
      summary: req.session.currentUser.summary,
      id: req.session.currentUser.id}
    );
    } else {
      res.render('auth/login', {
        errorMessage: "Oops, that password isn't correct. Try again"
      });
    }
  });
});

// EDIT CONTENT: takes the user to a page they can update info on about themselves
auth.get('/:id/edit', (req, res, next) => {
  if(req.session.currentUser) {
    const userID = req.session.currentUser._id;
    //returns the ID as a string -- may be important later, if needs to be a number
    User.findById(userID, (err, user)=>{
      if(err){
        return next(err);
      }
      // if they're logged in and click to edit, show the edit.ejs file info
      res.render('auth/edit', {
        name: user.name,
        username: user.username,
        image: user.image,
         job: user.job,
       company: user.company,
       summary: user.summary,
        id: user.id
      });
    });
  } else {
    res.render('auth/login', {
      errorMessage: "Oops, something went wrong. Please log in and try again"
    });
  }
});

// NEED TO CREATE THE EDIT PAGE AGAIN. TRY WITHOUT THE TEXT FIELD AND WITHOUT THE IMAGE FIRST
auth.post('/:id', (req, res, next) => { // why is this not post('/:id/edit')?
  if(req.session.currentUser) {
  const userID = req.params.id;

  const updates = {
    summary: req.body.summary,
    company: req.body.company,
    job: req.body.job,
    image: req.body.image
  };

  User.findByIdAndUpdate(userID, updates, (err, user) => {
      if(err){
        return next(err);
      }
      return res.render('auth/welcome', {
        username: user.username,
         name: user.name,
         image: req.body.image,
          job: req.body.job,
        company: req.body.company,
        summary: req.body.summary,
        id: user.id
      });
    });
  } else {
    res.render('auth/login', {
    errorMessage: "Oops, something went wrong. Please log in and try again"
    });
    }
});







// when the user lands on the /welcome page, show them the view at auth/welcome
auth.get('/welcome', (req, res, next) => {
  if(req.session.currentUser) {
    res.render('auth/welcome'
    ,{ username: req.session.currentUser.username,
        name: req.session.currentUser.name,
        image: req.session.currentUser.image,
         job: req.session.currentUser.job,
       company: req.session.currentUser.company,
       summary: req.session.currentUser.summary,
       id: req.session.currentUser.id}
  );} else {
    res.render('auth/login');
  }
});

auth.get('/logout', (req, res, next) => {
  req.session.destroy((err) =>{
    res.redirect('/');
  });
});

module.exports = auth;
