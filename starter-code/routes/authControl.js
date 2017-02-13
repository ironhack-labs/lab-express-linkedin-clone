var express = require('express');
var router = express.Router();

// User model
const User           = require("../models/users");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('authControl');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;

  console.log(name);

  if (email === "" || password === "") {
    console.log("email and password blank")
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

// SIGNUP
  User.findOne({ "email": email }, "email", (err, user) => {
    if (user !== null) {
      console.log("is this happening?")
      res.render("login", {
        errorMessage: "You already have an account"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name,
      email,
      password,
      // password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitle
    });

    newUser.save((err) => {
      res.redirect("/");
    });
  });
});


module.exports = router;
