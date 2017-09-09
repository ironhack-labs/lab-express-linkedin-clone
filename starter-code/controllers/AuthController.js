const User = require('../models/User')
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

module.exports = {
  signupGet: (req, res) => { res.render('auth/signup', {title: 'Sign up'}) },
  signupPost: (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    const email    = req.body.email
    const img      = req.body.img
    const company  = req.body.company
    const job      = req.body.job
    const sumary   = req.body.sumary

    if (username === "" || password === "") {
      res.render("auth/signup", {
        title: "Sign up",
        errorMessage: "Indicate a username and a password to sign up"
      })
      return
    }

    User.findOne({ "username": username }).then(user =>{
      if(user){
        res.render("auth/signup", {
          title: "Sign up",
          errorMessage: "User already exists"
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      new User({
          username: username,
          password: hashPass,
          email: email,
          imageUrl: img,
          company: company,
          jobTitle: job,
          sumary: sumary
        })
        .save()
        .then(() => res.redirect('/auth/login'))
        .catch(e => next(e));
    })
  },

  loginGet: (req, res) => { res.render('auth/login', {title: 'Log in'}) },
  loginPost: (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
  
    if (username === "" || password === "") {
      res.render('auth/login', {
        title: "Log in",
        errorMessage: 'Indicate a username and a password to log in'
      })
      return
    }
  
    User.findOne({ 'username': username }, (err, user) => {
        if (err || !user) {
          res.render("auth/login", {
            title: "Log in",
            errorMessage: "The username doesn't exist"
          })
          return
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user
          res.redirect('/user/profile')
         // res.render('user/profile', {
         //   title: 'User page',
         //   username: username
         // })
        } else {
          res.render('auth/login', {
            title: "Log in",
            errorMessage: 'Incorrect password'
          })
        }
    })
  },

  logout: (req, res) => {
    req.session.destroy(err => {
      res.redirect('/auth/login')
    })
  }
}