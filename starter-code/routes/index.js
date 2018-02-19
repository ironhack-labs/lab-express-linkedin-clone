var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");



//signup
router.get('/signup', function(req, res, next) {
  res.render('authentication/signup_form', {error:null});
});

router.post("/signup", (req,res)=>{
  //variables
  var userName = req.body.userName;
  var email = req.body.email;
  var password = req.body.password;
  var summary = req.body.summary;
  var imageUrl = req.body.imageUrl;
  var company = req.body.company;
  var jobTitle = req.body.jobTitle;
  // comprovar que el usuario escribió algo
  if (userName === "" || password === "" || email === "" || summary === "" || imageUrl === "" || company === "" || jobTitle === "") {
    res.render("authentication/signup_form", {
      error: "Rellena todos los campos"
    });
    return;
  }
  //comprobar que el correo no este en uso
  User.findOne({"email":email}, "email", (err,doc)=>{
    if(err) return res.send(err);
    if(doc) return res.render("authentication/signup_form", {error:"el correo esta en uso"});
  });

  //hasheamos el pass
  const salt = bcrypt.genSaltSync(256);
  const hashPass = bcrypt.hashSync(password, salt);
  //crea un usuario nuevo
  const user = new User({
    userName:userName,
    email: email,
    password: hashPass,
    summary: summary,
    imageUrl: imageUrl,
    company: company,
    jobTitle: jobTitle,
  });
  user.save((err, result)=>{
    if(err) return res.send(err);
    return res.redirect("/profile"); //cambia esto por el perfil
  });

});

//login
router.get('/login', function(req, res, next) {
  res.render('authentication/login_form', {error:null});
});
router.post("/login", (req,res)=>{
  //variables
  var email = req.body.email;
  var password = req.body.password;
  // comprovar que el usuario escribió algo
  if (email === "" || password === "") {
    res.render("authentication/login_form", {
      error: "Escribe tu usuario y contraseña"
    });
    return;
  }

  User.findOne({"email":email}, (err,doc)=>{
    if(err) return res.send(err);
    if(!doc) return res.render("login_form",{error:"tu usuario no existe"});
    if(!bcrypt.compareSync(password, doc.password)) return res.render("login_form",{error:"tu password no es correcto"});
    req.session.currentUser = doc;
    console.log(req.session.currentUser)
    res.redirect("/profile") //cambiar esto por el perfil
  });
});

//logout
router.get("/logout", (req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});


router.get('/', function(req, res, next) {
  if(req.session.currentUser) return res.redirect("/profile");
  res.render('index');
});


module.exports = router;
