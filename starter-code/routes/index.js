const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require("../models/User");


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LINKEDIN' });
});

router.get("/signup", (req, res, next) => {
  res.render("signup_form");
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("/signup_form", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("/signup_form", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("/signup_form", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

module.exports = router;
