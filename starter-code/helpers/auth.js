module.exports = {
  checkLoggedIn: (failPage)=>{
    return (req, res, next) => {
      if(req.session.user) {
        next();
      } else {
        res.redirect(failPage);
      }
    }
  },
  checkLoggedInAndSession: (failPage)=>{
    return (req, res, next) => {
      if(req.session.user && req.session.user._id===req.params.userId) {
        next();
      } else {
        res.redirect(failPage);
      }
    }
  }

}