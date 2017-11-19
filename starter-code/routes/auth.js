const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const bcryptSalt = 10;
const multer  = require('multer');
const uploader = multer({dest:'./public/uploads'});
const Picture = require('../models/Image')

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: 'Something went wrong...'
  });
});

router.post('/signup', (req, res, next) => {
  const nameInput = req.body.name;
  const emailInput = req.body.email;
  const passwordInput = req.body.password;
  const summaryInput = req.body.summary;
  const companyInput = req.body.company;
  const jobTitleInput = req.body.jobTitle;

router.post('/upload', upload.single('photo'), function(req, res){
  const image = new Image({
    image: `/uploads/${req.file.filename}`,
    image_name: req.file.originalname
  });
  image.save((err) => {
      res.redirect('/');
  });
});

  if (emailInput === '' || passwordInput === '') {
    res.render('auth/signup', {
      errorMessage: 'Enter both email and password to sign up.'
    });
    return;
  }

  User.findOne({ email: emailInput }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${emailInput} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(passwordInput, salt);
    const userSubmission = {
      name: nameInput,
      email: emailInput,
      password: hashedPass
    };

    const theUser = new User(userSubmission);
    theUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Something went wrong.'
        });
        return;
      }
      res.redirect('/show');
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

router.post('/login', (req, res, next) => {
  const {email, password} = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Enter both email and password to log in.'
    });
    return;
  }

  User.findOne({ email })
  .then(user => {
    if(!user) throw new Error(`There isn't an account with email ${email}.`);
    if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/show');
      }else{
        throw new Error('Invalid password');
      }
    }).catch(e => {
      res.render('auth/login', {
        errorMessage: e.message
    });
  });
});

router.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/signup');
  });
});


module.exports = router;
