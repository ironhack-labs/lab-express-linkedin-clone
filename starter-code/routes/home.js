var express = require('express');
var router = express.Router();
// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET Create a very basic home page with a message saying "Welcome < User Name >" 
once the user is logged in. If the user hasn't started a session, he should be 
redirected to /login page.*/
router.get('/', function (req, res, next) {
  if (req.session.currentUser) { 
    let id = req.session.currentUser;
    console.log(id)
    res.render('home'); }
  else { res.redirect("/login"); }
  
});

/*POST /signup. We save the user information in the database.*/
router.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let name = req.body.name;
  let email = req.body.email;
  let summary = req.body.summary;
  let imageUrl = req.body.imageUrl;
  let company = req.body.company;
  let jobTitle = req.body.jobTitle;

  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);
    console.log(`pre asignacion ${username}`)
    let newUser = User({
      username,
      name,
      email,
      password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitle
    });
    console.log(newUser);

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        console.log(newUser);
        res.redirect("/login");
        // User has been created...now what?
      }
    });
  });
});

// GET /login. If the user is already logged in, it should redirect him to the home page.
router.get("/login", (req, res, next) => {
  res.render("authentication/login");
});

// POST /login. We start user's session.
router.post("/login", (req, res, next) => {
  let username  = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }
  User.findOne({ "username": username },
    "_id username password following",
    (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The name doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
    });
});

// GET /logout. We end the user's session.
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});


module.exports = router;
