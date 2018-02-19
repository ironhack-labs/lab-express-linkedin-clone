var express = require('express');
var router = express.Router();
const User           = require("../models/User");
const bcrypt         = require("bcrypt");


router.get("/signup", (req,res)=>{
  if (req.session.currentUser) { res.redirect("/"); return; }
  res.render("authentication/signup", {errorMessage:null});
 });

router.post("/signup", (req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  var password2=req.body.password2;
  var email = req.body.email;

      if (username === "" || password === "") {
        res.render("authentication/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }
      if (password!=password2) {
        res.render("authentication/signup", {
          errorMessage: "Password don´t match! Try again"
        });
        return;
      }

  User.findOne({ "username": username}, "username", (err, doc) => {
        if (doc !== null) {
          res.render("authentication/signup", {
            errorMessage: "The username already exists"
          });
          return;
        }
        User.findOne({ "email":email}, "email", (err, doc) => {
          if (doc !== null) {
            res.render("authentication/signup", {
              errorMessage: "The email already exists"
            });
            return;
          }
        var salt     = bcrypt.genSaltSync(256);
        var hashPass = bcrypt.hashSync(password, salt);

        const user = new User({
          username:req.body.username,
          name:req.body.name,
          password: hashPass,
          email:req.body.email
        });

      user.save((err) => {
        if (err) {
          res.render("authentication/signup", {
            errorMessage: "Something went wrong when signing up"
          });
        } else {
          user.save((err, result)=>{
            if(err) return res.send(err);
            return res.redirect("/login"); //cambia esto por el perfil
          });
        }
      });
  });
});
});

// LOGIN
router.get("/login", (req,res)=>{
  if (req.session.currentUser) { res.redirect("/"); return; }
  res.render("authentication/login", {errorlogin:null});
 });


 router.post("/login", (req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
      if (username === "" || password === "") {
        res.render("authentication/login", {
          errorlogin: "Indicate a username and a password to log in"
        });
        return;
      }

      User.findOne({ "username": username },"_id username password",(err, doc) => {
        if (err || !doc) {
          res.render("authentication/login", {
            errorlogin: "The username doesn't exist"
          });
          return;
        } else {
          if (bcrypt.compareSync(password, doc.password)) {
            req.session.currentUser = doc;
            res.redirect("/");
          } else {
            res.render("authentication/login", {
              errorlogin: "Incorrect password"
            });
          }
        }
    });
});

//LOGOUT
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


/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.currentUser) { res.redirect("/login"); return; }
  console.log("8==========D");
  console.log(req.session.currentUser)
  res.render('home', { title: 'Linkedin', user:req.session.currentUser });
});

module.exports = router;
