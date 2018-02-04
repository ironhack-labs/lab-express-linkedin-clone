var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/home', function(req, res, next) {
  //res.render('index', { title: 'Home' });
  res.render('home');
});

module.exports = router;