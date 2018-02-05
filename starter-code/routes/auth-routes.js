const express = require("express");
const router = express.Router();
// User model
const User = require("../models/User");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;



router.get("/signup", (req, res) => {
  console.log("signup");
  res.render("auth/signup");
});

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/");
  });

router.post("/signup", (req, res, next) => {
      console.log(req.body);
      let username = req.body.username;
      let password = req.body.password;
    
      if (username == "" || password == "") {
        console.log("EMPTY");
        res.render("auth/signup", {
          errorMessage: "Name or password can't be empty"
        });
        return;
    }

    User.findOne({ username: username }, (err, user) => {
            if (user !== null) {
            res.render("auth/signup", {
                errorMessage: "The Name already exists"
            });
            return;
            }

            let salt = bcrypt.genSaltSync(bcryptSalt);
            let hashPass = bcrypt.hashSync(password, salt);
            let newUser = User({
            name:req.body.name,
            password: hashPass,
            username:username,
            mail:req.body.email
            });
        
            newUser.save(err => {
            res.redirect("/signup");
            });
        });
        
    })


router.get("/login", (req, res) => {
        res.render("auth/login");
    });
        
router.post("/login", (req, res) => {
    console.log(req.body)
    if (req.body.username == "" || req.body.password == "") {
        res.render("auth/login", {
          errorMessage: "Username or password can't be empty"
        });
        return;
      }
    
      User.findOne({ username: req.body.username }, (err, user) => {
        if (err || !user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
    if(bcrypt.compareSync(req.body.password, user.password)){
            req.user = user; //req.session???
              res.render("index", {user:user,title:"Linkedin"});
            } else {
              res.render("auth/login", {
                errorMessage: "Incorrect password"
              });
            }
    
      });
});
      
module.exports = router;