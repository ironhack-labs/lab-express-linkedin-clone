const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;

// GET SIGNUP
router.get("/signup", function(req, res) {
 let user = req.session.currentUser;
  if(user){
    res.redirect("/")
  } else {
    res.render("authentication/signup");
  }
});

// POST SIGN UP
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
      res.redirect("/login");
    });
  });
});

// GET LOGIN 
router.get("/login", function(req, res) {
  let user = req.session.currentUser;
  if(user){
    res.redirect("/")
  } else {
    res.render("authentication/login");
  }
});

//POST LOGIN
router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username == "" || password == "") {
    res.render("authentication/login", {
      errorMessage: "Username or password can't be empty"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("authentication/login", {
        errorMessage: "The username or password are wrong"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("authentication/login", {
        errorMessage: "The username or password are wrong"
      });
    }
  });
});

router.get('/logout',(req,res) => {
  req.session.currentUser = null;
  res.redirect('/');
})


module.exports = router;
