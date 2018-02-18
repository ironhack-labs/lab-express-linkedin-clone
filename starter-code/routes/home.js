var express = require('express');
var router = express.Router();

// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
//const bcryptSalt     = 10;

router.get("/signup", (req,res)=>{
  res.render("signup", {errorsignup:null});
 });

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  //comprobar que el correo no este en uso
  if (username == "" || password == "") {
    res.render("signup", {
      error: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({mail:req.body.email}, (err,doc)=>{
    if(err) return res.send(err);
    if (doc) {
      res.render("signup", {errorsignup:"el correo esta en uso"});
      return;
    } else {
      //hasheamos el pass
      const salt = bcrypt.genSaltSync(256);
      const hashPass = bcrypt.hashSync(req.body.password, salt);
      //crea un usuario nuevo
      const user = new User({
        username:req.body.username,
        name:req.body.name,
        password: hashPass,
        email:req.body.email
      });
      user.save((err, result)=>{
        if(err) return res.send(err);
        return res.redirect("/"); //cambia esto por el perfil

      });

    }
    
  });



});

router.get("/login", (req,res)=>{
  res.render("login", {errorlogin:null});
 });


 router.post("/login", (req,res)=>{
  User.findOne({username:req.body.username}, (err,doc)=>{
    if(err) return res.send(err);
    if(!doc) return res.render("login",{errorlogin:"tu usuario no existe"});
    if(!bcrypt.compareSync(req.body.password, doc.password)) return res.render("login",{errorlogin:"tu password no es correcto"});
    req.session.currentUser = doc;
    res.redirect("/") //cambiar esto por el perfil
  });
});



























/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Linkedin' });
});

module.exports = router;
