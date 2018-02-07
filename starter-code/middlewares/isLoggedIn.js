const isLoggedIn = (req,res,next) => {
    if(req.user){
        next();
    }else{
        console.log("[Forbidden] User cannot access this page");
        res.redirect('/');
    }
}

module.exports = isLoggedIn;