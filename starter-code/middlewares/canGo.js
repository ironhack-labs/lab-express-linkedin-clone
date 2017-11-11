module.exports = (req,res,next) =>{
  if(req.session.currentUser){
    next();
  } else {
    res.render('auth/login',{errorMessage: "Denied access, Sign in first !"});
  }
};
