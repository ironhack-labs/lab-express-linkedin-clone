const siteRoutes = require('express').Router();
const User = require('../models/User')
const Review = require('../models/Reviews')
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
  let myReviews = "";
  const userId = req.session.currentUser._id
  Review.find({}, (err, reviews)=>{
    if(err){
      next(err)
    }
    else {
      myReviews = reviews
      res.render("index", {title: "Home Page", id : req.session.currentUser._id, revi: myReviews})
    }
  })

})

siteRoutes.get("/profile/:id",(req, res, next)=>{
  let myReviews = "";
  const userId = req.params.id
  Review.find({"user_id" : userId}, (err, reviews)=>{
    if(err){
      next(err)
    }
    else {
      myReviews = reviews
    }
  })
  User.findOne({ "_id" : userId}, (err, user) =>{
    if(user){
    res.render("profile", {title: "Your Profile", user : user, reviews : myReviews})
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

siteRoutes.get('/privateList',(req, res, next) =>{
  User.find({},(err, user)=>{
    if(err){
      next(err);
    }else{
      res.render("profileList", {users: user, type: "private"})
    }
  })

})
siteRoutes.get('/privateprofile/:id',(req, res, next) =>{
  const userId = req.params.id

  User.find({"_id" : userId},(err, user) =>{
    if(err){
      next(err)
    }else{
      res.render("private", {user: user, title: "Profile"})
    }
  });
})
siteRoutes.post('/profile/id:/post', (req, res, next)=>{
  const user = req.session.currentUser
  User.findOne({"name": user.name}).exec((err,user)=>{
    if(err){return;}

    const newReview = Review ({
      review : req.body.review,
      user_id : user._id,
      user_name : user.name
    })

    newReview.save((err)=>{
      if(err){
        next(err)
      }else{
        res.render("profile", {title: "Your Profile", user : user})
      }
    })

  })
});
module.exports = siteRoutes
