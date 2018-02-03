const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;

/* GET INDEX - SIGNUP */
router.get("/signup", function(req, res) {
  res.render("authentication/signup");
});

router.post("/signup", function(req,res){
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;

  if (username == "" || password == "" || name == "" || email == "") {
    res.render("authentication/signup", {
      errorMessage: "The inputs can't be empty"
    });
    return;
  }
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username,
      password: hashPass,
      name,
      email
    });

    newUser.save(err => {
      res.redirect("/signup");
    });
  });
});

module.exports = router;
