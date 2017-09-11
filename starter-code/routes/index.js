const express = require('express')
const router = express.Router()
const isLoggedIn = require('../middlewares/isLoggedIn')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth/login', {
    header: 'Login'
  })
})

router.get('/home', isLoggedIn('/home'), (req, res) => {
  res.render('home', {
    user: req.session.currentUser
  })
})

module.exports = router
