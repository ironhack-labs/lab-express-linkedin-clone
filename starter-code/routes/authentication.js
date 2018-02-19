var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const User = require("../models/User");



router.get('/', function(req, res, next) {
  
  if(req.session.currentUser){
      return res.redirect("/");
  } else{
    res.redirect("authentication/login");
  }
});

router.get('/login', function(req, res, next) {
  if(req.session.currentUser){
    console.log(req.session)
      return res.redirect("/");
  } else {
    res.render("authentication/log-in", {logError:null});
  }
});

router.post("/login", function(req, res, next) {
  User.findOne({userName:req.body.username}, (err,doc)=>{
      if(err){
          return res.render("authentication/log-in", {logError:"Your Username is incorrect"})
      } else {
          if (doc){
              if(bcrypt.compareSync(req.body.password, doc.password)){
                  req.session.currentUser = doc;
                  res.redirect("/");
                } else {
                    res.render("authentication/log-in", {logError:"Your Password is wrong"})
                }
          } else {
              return res.render("authentication/log-in", {logError:"Your Username is incorrect"})
          }
          
      }
      
    });
    
});

router.get("/signUp", function(req, res, next) {
  if(req.session.currentUser){
    return res.redirect("/");
} else{
  res.render("authentication/sign-up", {error:null});
}
});

router.post("/signUp", function(req, res, next) {
  if(req.body.password2 !== req.body.password1){
      return res.render("authentication/sign-up", {error:"Your passwords don't match!"})
  }
  User.findOne({userName:req.body.username}, (err,doc)=>{
      if(doc){
        return res.render("authentication/sign-up", {error:"Your username is taken"})
      } else {
        console.log("Si crea")
          const hash = bcrypt.hashSync(req.body.password1, salt);
          const user = new User({
            userName: req.body.username,
            password: hash,
            name: req.body.name,
            email: req.body.email
          });
          user.save((err,result)=>{
          if(!err){
          return res.redirect("/authentication/login");
      }
    });
      }
    });
    
});

router.get('/logout', function(req, res, next) {
  req.session.currentUser=null;
  res.redirect("/authentication/login");
});



module.exports = router;
