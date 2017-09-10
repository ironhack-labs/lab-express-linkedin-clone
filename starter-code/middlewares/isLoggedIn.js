const isLoggedIn = (redirectURL) => {
  return (req,res,next) => {
      if (req.session.currentUser) {
        next();
      } else {
        console.log("Unlogged user.. redirect !!");
        res.redirect(redirectURL);
      }
  };
};

module.exports = isLoggedIn;
