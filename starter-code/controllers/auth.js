const User = require('../models/User')
const session = require('express-session')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

module.exports = {
  signupGet: (req, res) => { res.render('authentication/signup',
                                        {title: `Sign up`}) },
  signupPost: (req, res) => {
    const username = req.body.username
    const email    = req.body.email
    const password = req.body.password

    if (username === '' || email === ''  || password === '') {
      res.render('authentication/signup', {
        errorMessage: 'Indicate an username, an email and a password to sign up',
        title: `Sign up`
      })
      return
    }

    User.findOne({ "email": email }, "email").then(user => {
      if (user) {
        res.render('authentication/signup', {
          errorMessage: 'This user already exists',
          title: `Sign up`})
        return
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      new User({
        name: username,
        email: email,
        password: hashPass
      })
      .save()
      .then(() => res.redirect('/login'))
      .catch(err => {res.render('authentication/signup', {
            errorMessage: `Something went wrong when signing up`,
            title: `Sign up`})})
    })
  },

  loginGet: (req, res) => {res.render('authentication/login',
                                        {title: `Log In`}) },

  loginPost: (req, res) => {
    const email    = req.body.email
    const password = req.body.password

    if (email === ''  || password === '') {
      res.render('authentication/login', {
        errorMessage: 'Indicate an email and a password to log in',
        title: `Log in`
      })
      return
    }

    User.findOne({ "email": email }).then((user, err) => {
      if (err || !user) {
        res.render('authentication/login', {
          errorMessage: `The user doesn't exist`,
          title: `Log in`})
        return
      }else {
        if (bcrypt.compareSync(password, user.password)){
          req.session.currentUser = user
          console.log(`${user}`);
          res.render('home', {
            username : user.name,
            title: `Home`})
        }else {
          res.render('authentication/login', {
            errorMessage: 'Incorrect password',
            title: `Log in`})
        }
      }
    })
  },

  logoutGet: (req, res, next) => {
    if (!req.session.currentUser) res.redirect("/")

    req.session.destroy(err => {
      if(err) next(err)
      else res.redirect("/login")
    })
  }
}
