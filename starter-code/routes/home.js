var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.currentUser;
  if (user) {
    res.render('home', user);
  } else {
    res.redirect('users/login');
  }
});

module.exports = router;
