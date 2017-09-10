const isLoggedIn = (redirectURL) => {
  return (req,res,next) => {
      if (req.session.currentUser) {
        next()
      } else {
        console.log('First log in the page')
        res.redirect(redirectURL)
      }
  }
}

module.exports = isLoggedIn
