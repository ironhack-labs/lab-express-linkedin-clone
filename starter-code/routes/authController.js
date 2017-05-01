/*jshint esversion: 6*/
const express           = require('express');
const authController    = express.Router();

//User model
const User              = require("../models/user");

//Bcrypt to encrypt passwords
const bcrypt            =require('bcrypt');
const bcryptSalt        =10;

authController.get("/signup", (req, res, next) => {
  if (req.session.currentUser) { res.redirect("/"); return; }
  res.render("auth/signup");
});

authController.post("/signup", (req, res, next) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;

  // if (email ==="" || password === "") {
  //   res.render("auth/signup", {
  //     errorMessage: "Indicate a password to sign up"
  //   });
  //   return;
  // }


  User.findOne({ "email": email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The email already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name,
      email,
      password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitle,
    });

    newUser.save((err) => {
      if (err) {
        if(password ==="")
        {
          res.render("auth/signup", {
            errorMessage: "Indicate a password to sign up",
            requiredErrorMessage: newUser.errors
          });
        }
        else {
          res.render("auth/signup", {
            requiredErrorMessage: newUser.errors
          });
        }

      } else {
       res.redirect("/login");
     }
    });
  });
});

authController.get("/login", (req, res, next) => {
  if (req.session.currentUser) { res.redirect("/"); return; }
  res.render("auth/login");
});

authController.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a email and a password to log in"
    });
    return;
  }

  User.findOne({ "email": email },
    "_id name email password summary imageurl company jobTitle",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The user doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          // logged in
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

//question: after or before authController.use()... that checks if the user has already logged in. Question because this function is already doing this.
authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});

//Commented to make the application more functional
// authController.use((req, res, next) => {
//   if (req.session.currentUser) { next(); }
//   else { res.redirect("/login"); }
// });

authController.get('/', function(req, res, next) {
  const currentUser = req.session.currentUser;
  User.find({},(err,users)=>{
    res.render('index', {currentUser: currentUser, users:users});
  });
});

authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});


module.exports = authController;
