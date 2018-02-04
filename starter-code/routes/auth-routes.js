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

router.post("/signup", (req, res, next) => {
      console.log(req.body);
      let name = req.body.name;
      let password = req.body.password;
    
      if (name == "" || password == "") {
        console.log("EMPTY");
        res.render("auth/signup", {
          errorMessage: "Name or password can't be empty"
        });
        return;
    }

User.findOne({ name: name }, "Name", (err, user) => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The Name already exists"
          });
          return;
        }
        let salt = bcrypt.genSaltSync(bcryptSalt);
        let hashPass = bcrypt.hashSync(password, salt);
    
        let newUser = User({
          name,
          password: hashPass
        });
    
        newUser.save(err => {
          res.redirect("/signup");
        });
      });
    
    })

module.exports = router;