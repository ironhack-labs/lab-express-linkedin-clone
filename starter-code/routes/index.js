var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.currentUser !== undefined) {
    console.log('BODDDDYYYYY',req.session);
      res.render('home', {
        title: 'Home',
        currentUser: req.session.currentUser
      });
  } else {
    res.redirect('/auth/login');
  }
});

module.exports = router;
