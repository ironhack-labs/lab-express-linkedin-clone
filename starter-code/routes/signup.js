var express = require('express');
var router = express.Router();
const User = require('../models/User');



router.get('/', function(req, res, next) {
  res.render('signup', {title: 'Sign up now!'});
});

router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  if(username === "" || password === "") {
    res.render('/signup', {
      erorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }).then(user => {
    if(user) {
      res.render('/signup', {
        errorMessage: "User already exist"
      })
      return
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
      username: username,
      password: hashPass
    })
    .save()
    .then(() => res.redirect('/signup'))
    .catch(e => next(e));
  })
  console.log(req.body)
});

module.exports = router;
