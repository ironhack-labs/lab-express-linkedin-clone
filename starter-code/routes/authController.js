/* jshint esversion:6*/
//will define the routes we need to create the basic authorization

const express = require("express");
const authController = express.Router();

  // User model
  const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

///////////////////////////////////////////////////////////////
////////////SIGNUP PAGE//////////////////////////////////
///////////////////////////////////////////////////////////////
authController.get("/signup", (req, res, next) => {
  var usernameSingUp = req.body.username;
  if(req.session.currentUser == null){
    res.render("authentication/signup");
    return;
  }
    else{res.render("./home",{welcomemessage: "Welcome "+usernameSingUp});}

});

authController.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var summary  = req.body.summary;
  var imageUrl  = req.body.imageUrl;
  var company  = req.body.company;
  var jobTitle  = req.body.jobTitle;

  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

///check if  user and password are blank
  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
// /// Checjs if userName already exists
  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

// Create the user
    var newUser = User({
      username,
      password: hashPass,
      summary,
      imageUrl,
      company,
      jobTitle
    });

//save the new user onto the Database
    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong"
          });
        } else {
            res.redirect("/login");
            }
      });
  });
});
///////////////////////////////////////////////////////////////
////////////////////LOGIN PAGE //////////////////////////
//////////////////////////////////////////////////////////////
authController.get("/login", (req, res, next) => {
  var usernameLogin = req.body.username;
  if(req.session.currentUser == null){
    res.render("authentication/login");
    return;
  }
    else{res.render("./home",{welcomemessage: "Welcome "+usernameLogin});}
});
authController.post("/login", (req, res, next) => {
  var usernameLog = req.body.username;
  var passwordLog = req.body.password;

  if (usernameLog === "" || passwordLog === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": usernameLog },
    "_id username password following",
    (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(passwordLog, user.password)) {
          req.session.currentUser = user; // WE CREATE THE USER SESSION HERE
          res.render("./home",{welcomemessage: "Welcome "+usernameLog});//,{welcomemessage: "Welcome "+usernameLog}
        } else {
          res.render("authentication/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

///////////////////LOG OUT///////////////////////////////////

authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("login");
    }
  });
});
/////////////////////ITERATION2/////////////////////////////////////////
authController.get("/profile/:userId/edit", (req, res, next) => {
  const id = req.params.id;
   User.findById(id, function (err, user) {
     if (err) return next(err);
     res.render('profile/edit',{user});
   }
 );
});

authController.get("/profile/:userId", (req, res, next) => {
  const id = req.params.id;
  User.findById(id, function (err, user) {
    if (err) return next(err);
    res.render('show',{user});
      }
    );
  });

authController.post("/profile/:userId", (req, res, next) => {
  const id = req.params.id;
  const body= req.body;

  User.findByIdAndUpdate(id,body, function (err) {
    if (err) return next(err);
    res.redirect('profile/edit');
      }
  );
  });

  authController.post("/home", (req, res) => {
    var userSearch = req.body.userSearch;
    if(req.session.currentUser === null){
      res.render("profile/:userId");
      return;
    }
  });

/////////////////////////////////////////////////////////////////////

//////////////////If its Home
authController.get("/", (req, res) => {
  var usernameFirst = req.body.username;
  if(req.session.currentUser === null){
    res.render("authentication/login");
    return;
  }
    else{res.render("./home",{welcomemessage: "Welcome "+usernameFirst});}
  // res.redirect("/login");
});
//////////////////If its Home



module.exports = authController;
