module.exports = (redirectURL) => {
  return (req, res, next) => {
    if (req.session.currentUser) {
      next()
    } else {
      console.log("No puedes Pasar!!")
      res.redirect(redirectURL)
    }
  }
}