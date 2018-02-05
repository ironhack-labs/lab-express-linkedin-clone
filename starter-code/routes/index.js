var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.currentUser){ return res.redirect('/users/login');}
  res.render('index', { title: 'Express', loggedIn: req.session.currentUser !== undefined, username : req.session.currentUser.name });
});

module.exports = router;
