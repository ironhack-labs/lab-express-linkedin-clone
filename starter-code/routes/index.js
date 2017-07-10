var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.currentUser === undefined) {
    res.render('login', {
      title: 'LinkedIn Clone'
    });
  } else {
    res.render('index', {
      title: 'LinkedIn Clone',
      session: req.session.currentUser
    });
  }
});

module.exports = router;
