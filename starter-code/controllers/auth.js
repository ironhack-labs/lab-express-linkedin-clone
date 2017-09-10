const User = require('../models/User')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

module.exports = {
  signupGet: (req, res) => { res.render('authentication/signup',
                                        {title: `Sign up`}) },
  signupPost: (req, res) => {
    const username = req.body.username
    const email    = req.body.email
    const password = req.body.password

    if (username === "" || email === ""  || password === "") {
      res.render("authentication/signup", {
        errorMessage: "Indicate an username, an email and a password to sign up",
        title: `Sign up`
      })
      return
    }

    User.findOne({ "username": username }).then(user => {
      if (user) {
        res.render("authentication/signup", {
          errorMessage: "The username already exists",
          title: `Sign up`})
        return
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      console.log(`salto: ${salt}, hash: ${hashPass}, username: ${username}, email: ${email}, pwd: ${password}`);
      new User({
        name: username,
        email: email,
        password: hashPass
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(err => {res.render("authentication/signup", {
            errorMessage: `Something went wrong when signing up`,
            title: `Sign up`})})
    })
  }
}
