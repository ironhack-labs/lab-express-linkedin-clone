const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


//renders and show the signup page with the form
router.get('/signup', (req, res, next) => {
  res.render("authentication/signup");
});

//retrieves the data from the form
router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var jobTitle = req.body.jobTitle;
  var company = req.body.company;

  console.log(req.body);

  if (username === "") {
    res.render("authentication/signup", {
      errorMessage: "Enter a USERNAME to sign up"
    });
    return;
  }
  if (password === "") {
    res.render("authentication/signup", {
      errorMessage: "Enter a PASSWORD to sign up"
    });
    return;
  }
  if (email === "") {
    res.render("authentication/signup", {
      errorMessage: "Enter an E-MAIL to sign up"
    });
    return;
  }
  if (company === "") {
    res.render("authentication/signup", {
      errorMessage: "Enter the name of a COMPANY to sign up"
    });
    return;
  }
  if (jobTitle === "") {
    res.render("authenticaton/signup", {
      error: "Enter your JOBTITLE to signup"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
    res.render('signup', {
        errorMessage: "Sorry, this username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username: username,
           password: hashPass,
           email: email,
           summary: summary,
           imageUrl: imageUrl,
           company: company,
           jobTitle: jobTitle
    });

    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.render("authentication/signup", {
          createdUser: "User has been just created"
        });
      }
    });
  });
});


router.get("/login", (req, res, next) => {
  res.render("authentication/login");
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

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
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          return res.redirect("/");
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});


module.exports = router;
