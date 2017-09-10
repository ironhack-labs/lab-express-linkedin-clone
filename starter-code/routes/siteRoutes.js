const siteRoutes = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
siteRoutes.use((req, res, next)=>{
  if(req.session.currentUser){
    next();
  }
  else{
    res.redirect('/login')
  }
})

siteRoutes.get("/",(req,res,next) =>{
  res.render("index", {title: "Home Page", id : req.session.currentUser._id})
})

siteRoutes.get("/profile/:id",(req, res, next)=>{
  User.findOne({ "_id" : req.params.id}, (err, user) =>{
    if(user){
    res.render("profile", {title: "Your Profile", user : user})
  }
  })
})

siteRoutes.get("/profile/edit/:id",(req, res, next)=>{
  User.findOne({"_id" : req.params.id}, (err, user)=>{
    if(user){
    res.render("edit", {title : "Edit your profile", user: user})
  }
  else{
    next(err);
  }
  })
})
siteRoutes.post("/edit/:id", (req,res,next) =>{
  const userId = req.params.id
  const myUserPass = req.body.pass

  let salt = bcrypt.genSaltSync(bcryptSalt)
  let hashPass = bcrypt.hashSync(myUserPass, salt)

  const updates = {
    name : req.body.user,
    email : req.body.email,
    password : hashPass,
    user: req.body.name,
    summary : req.body.summary,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
    imageUrl : req.body.image,
  }
  User.findByIdAndUpdate(userId, updates, (err, user)=>{
    if(err){return next(err)}
    return res.redirect("/")
  })
})

module.exports = siteRoutes
