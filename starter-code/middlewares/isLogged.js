module.exports = (req,res,next) =>{
  if(req.session.currentUser){
    res.render('user/home',{errorMessage: "You already Log in!"});
    } else {
    next();
  }
};
