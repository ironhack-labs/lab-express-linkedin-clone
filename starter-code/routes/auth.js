const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let summary = req.body.summary;
  let company = req.body.company;
  let jobTitle = req.body.jobTitle;
  let imageUrl = req.body.imageUrl;
  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser  = User({
    name,
    email,
    password: hashPass,
    summary,

  });

  newUser.save((err) => {
    res.redirect("/");
  });
});

module.exports = router;
