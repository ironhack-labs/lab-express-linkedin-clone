const express = require('express')
const router  = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
if (req.session.currentUser) {
  res.render('index',{
    user: req.session.currentUser.name
  })
} else {
  res.redirect("login")}
})

module.exports = router
