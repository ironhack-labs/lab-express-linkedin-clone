var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//login process
router.get("/authentication/signup", (req,res)=>{
  res.render("signup_form", {error:null});
});

router.post("/authentication/signup", (req,res)=>{
  //comprobar que el correo no este en uso
  User.findOne({username:req.body.username}, (err,doc)=>{
    if(err) return res.send(err);
    if(doc) return res.render("signup_form", {error:"This user name is already taken. Please choose another user name"});
  });

  //hasheamos el pass
  const salt = bcrypt.genSaltSync(256);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  //crea un usuario nuevo
  const user = new User({
    username:req.body.username,
    password: hashPass
  });
  user.save((err, result)=>{
    if(err) return res.send(err);
    return res.redirect("/"); //cambia esto por el perfil
    });

  });

  
//login
router.get("/authentication/login", (req,res)=>{
  res.render("login_form", {error:null});
});

router.post("/authentication/login", (req,res)=>{
  User.findOne({username:req.body.username}, (err,doc)=>{
    if(err) return res.send(err);
    if(!doc) return res.render("login_form",{error:"your user is missing"});
    if(!bcrypt.compareSync(req.body.password, doc.password)) return res.render("login_form",{error:"your password is not correct"});
    req.session.currentUser = doc;
    res.redirect("/welcome_page") //cambiar esto por el perfil
  });
});

router.post("/logout", (req,res)=>{
  req.session.destroy();
  res.redirect("/")
});

//welcome
router.get("/welcome_page", (req,res)=>{
  res.render("welcome_page", {error:null});
});
router.post("/welcome_page", (req,res)=>{
   User.findOne({username:req.body.username}, (err,doc)=>{
     if(err) return res.send(err);
return res.redirect("/welcome_page");
     req.session.currentUser = doc;
     res.redirect("/welcome_page") //cambiar esto por el perfil
  });
 });


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
