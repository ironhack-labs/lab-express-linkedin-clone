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
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
  res.render('home');
});

/*POST /signup. We save the user information in the database.*/
router.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

router.post("/signup", (req, res, next) => {
  var name = req.body.name;
  var password = req.body.password;

  if (name === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a name and a password to sign up"
    });
    return;
  }

  User.findOne({ "name": name }, "name", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The name already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
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
  var name = req.body.name;
  var password = req.body.password;

  if (name === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a name and a password to log in"
    });
    return;
  }
  User.findOne({ "name": name },
    "_id name password following",
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
  if (!req.session.currentUser) { res.redirect("/"); return; }
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});




module.exports = router;
