var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.currentUser !== undefined) {
    res.render('index', {
      session: req.session.currentUser
    });
  } else {
    res.render('auth/login');
  }

});

module.exports = router;
