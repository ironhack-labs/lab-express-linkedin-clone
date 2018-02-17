var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get('/home', function(req, res, next) {
  if(req.session.currentUser){
    return res.redirect("home");
  }
  res.render("authentication/login_form", {error:null})
});

//signup
router.get('/signup', function(req, res, next) {
  res.render('authentication/signup_form', {error:null});
});

router.post("/signup", (req,res)=>{
  //comprobar que el correo no este en uso
  User.findOne({username:req.body.userName}, (err,doc)=>{
    if(err) return res.send(err);
    if(doc) return res.render("signup_form", {error:"el correo esta en uso"});
  });

  //hasheamos el pass
  const salt = bcrypt.genSaltSync(256);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  //crea un usuario nuevo
  const user = new User({
    userName:req.body.userName,
    email: req.body.email,
    password: hashPass,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
  });
  user.save((err, result)=>{
    if(err) return res.send(err);
    return res.redirect("/home"); //cambia esto por el perfil
  });

});

//login
router.get('/login', function(req, res, next) {
  res.render('authentication/login_form', {error:null});
});
router.post("/login", (req,res)=>{
  User.findOne({username:req.body.userName}, (err,doc)=>{
    if(err) return res.send(err);
    if(!doc) return res.render("login_form",{error:"tu usuario no existe"});
    if(!bcrypt.compareSync(req.body.password, doc.password)) return res.render("login_form",{error:"tu password no es correcto"});
    req.session.currentUser = doc;
    res.redirect("/home") //cambiar esto por el perfil
  });
});

router.post("/logout", (req,res)=>{
  req.session.destroy();
  res.redirect("/home")
});


router.get('/', function(req, res, next) {
  // if(req.session.currentUser) return res.render('home');
  res.render('index');
});


module.exports = router;
