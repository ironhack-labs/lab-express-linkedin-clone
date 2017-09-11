const User = require('../../models/User')
const Review = require('../../models/Reviews')
const bcrypt = require('bcrypt')
const bcryptSalt = 10

module.exports = {
  home : function(req, res, next) {
    res.render('index', { title: 'Express' })
  },
  signup : (req, res, next)=>{
    res.render('signup', {title: "Sign Up", errMessage : ""});
  },
  postSignUp : (req, res, next) =>{
    const myUserPass = req.body.pass
    const myUserName = req.body.user
    const myUserMail = req.body.email
    const myUserUser = req.body.name
    if(myUserName == "" || myUserPass == "" || myUserMail == ""|| myUserUser ==""){
      res.render('signup',{errMessage : "Please fill all the mandatory inputs"})
      return
    }

    User.findOne({"name" : myUserName}, (err,user)=>{
      if(user !== null){
        res.render('signup', {errMessage: "That user already exists"})
        return
      }
    let salt = bcrypt.genSaltSync(bcryptSalt)
    let hashPass = bcrypt.hashSync(myUserPass, salt)

    const newUser = User({
      name: myUserName,
      email: myUserMail,
      password: hashPass,
      user : myUserUser,
      summary: req.body.summary,
      company: req.body.company,
      jobTitle: req.body.jobTitle,
      imageUrl : req.body.image
    })
    newUser.save((err)=>{
    if(err){
    res.render("index", {errMessage: "Something went wrong"})
  }else {
    res.render("login", {errMessage: "Please Log in", title: "Log in"})
  }

  })
    })
},
login : (req,res,next)=>{
  res.render("login", {errMessage: "", title: "Log in"})
},
postLogin : (req,res,next)=>{
  const reviews = ""
  const myUser = req.body.user
  const myPass = req.body.pass
  if(myUser == "" || myPass == ""){
    res.render('login',{errMessage: "Indicate username and password", title: "Log in"})
    return
  }
  Review.find({}, (err, reviews)=>{
    if(err){
      next(err)
    }
    else {
      myReviews = reviews
    }
  })
  User.findOne({"name" : myUser}, (err, user)=>{
    if(err || !user){
      res.render("login",{errMessage: "The user name doesn't exist", title: "Log in"})
      return
    }
    if(bcrypt.compareSync(myPass, user.password)){
      req.session.currentUser = user;


      res.render('index',{id: user._id, revi :reviews})
    }else{
      res.render('login',{errMessage: "Incorrect password", title: "Log in"})
    }
  })
},
logOut : (req,res,next)=>{
  req.session.destroy((err)=>{
    res.redirect("/login")
  })
},
profiles : (req, res, next)=>{
  User.find({},(err, users) =>{
    if(err){
      next(err)
    }
    else{
      res.render("profileList", {users : users,  type: "public"})
    }
  })
},
publicView : (req, res, next)=>{
  const userId = req.params.id
  User.find({"_id" : userId},(err, user) =>{
    if(err){
      next(err)
    }else{

      res.render("public", {user: user, title: "Profile"})
    }
  });
}
}
