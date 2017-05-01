routes               = require("express").Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

routes.get('/signup', (req, res, next)=>{
  res.render('authentication/signup');
});


routes.get('/login', (req, res, next)=> {
  if(req.session.user) {
    res.redirect("/");
  } else {
    res.render('authentication/login');
  }
});

routes.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Please enter user name and password"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The user doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        console.log("session")
        req.session.user = user;
        res.redirect("/");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

routes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Please enter user name and password"
    });
    return;
  }

  User.findOne({ "username": username }, 
  "username",
  (err, user) => {
    if (user !== null) {
      console.log('here')
      res.render("authentication/signup", {
        errorMessage: "The user already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);
    
    var newUser = User({
      username,
      password: hashPass,
      name:req.body.name,
      email:req.body.email
    });
    
    newUser.save((err) => {
      if (err) {
        res.render("authentication/signup", {
          errorMessage: "Something went wrong"
        });
      } else {
        res.redirect("login");
      }
    });
  });
});

routes.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("login");
  });
});

module.exports = routes;
