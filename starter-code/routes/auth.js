const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const sessionMiddleware = require('../middlewares/session');

const User = require('../models/user');

authRouter.get('/login', sessionMiddleware('/profile'), (req, res, next) => {
  res.render('auth/login');
});

authRouter.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRouter.post('/signup', (req, res, next) => {
  const { name, email, password, summary, imageUrl, company, jobTitle } = req.body;

  if (name === '' || email === '' || password === '') {
    const error = 'Some of the fields are empty.';
    res.render('auth/signup', { error });
  } else {
    User.findOne({ name })
      .then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const newUser = {
            name,
            email,
            password: hashPass,
            summary,
            imageUrl,
            company,
            jobTitle,
          };
          User.create(newUser)
            .then((doc) => {
              res.redirect('/login');
            })
            .catch((err) => {
              const error = 'Something went wrong. Please, try again.';
              res.render('auth/signup', { error });
            });
        } else {
          const error = 'This user already exists.';
          res.render('auth/signup', { error });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});


authRouter.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    const error = 'Email y password no pueden estar vacios';
    res.render('auth/login', { error });
  } else {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          const error = 'email y password incorrectos';
          res.render('auth/login', { error });
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect('/profile');
        } else {
          const error = 'usuario y password incorrectos';
          res.render('auth/login', { error });
        }
      });
  }
});

authRouter.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next(err)
      } else {
        return  res.redirect('/');
      }
    });
  }
});


module.exports = authRouter;