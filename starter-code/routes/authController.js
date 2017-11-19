const express        = require("express");
const authController = express.Router();
const User           = require("../models/user");
const Post = require("../models/post");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const moment = require("moment");

//redirections to login page or home depending of logged state
authController.get("/", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("login");
    return;
  }
  const user = req.session.currentUser;
  const follows = [];
// Show Connections and their Posts
user.following.forEach(e => {
  User.findOne({
    _id: e
  }).exec((err, newUser) => {
    if (newUser) {
      follows.push(newUser);
      }
  });
});

  // Show posts in homepage.
  Post.find({
      "_creator": user._id
    }, "")
    .sort({
      created_at: -1
    })
    .exec((err, posts) => {
      res.render("home", {
        user: user,
        follows: follows,
        posts: posts,
        moment,
      });
    });
});

// Signup get and post
authController.get("/signup", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/signup");
    return;
  }
  res.redirect("/");
});

// conditions before we save the user
authController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;


  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate an username, an email, and a password to sign up"
    });
    return;
  }

  User.findOne({ "email": email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The email already exists"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      email,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});

//Login get and post
authController.get("/login", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("auth/login");
    return;
  }
  res.redirect("/");
});

authController.post("/login", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "email": email },
    "",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "This email doesn't exist as user"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
        //  res.redirect("/posts");
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});

//Logout
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
