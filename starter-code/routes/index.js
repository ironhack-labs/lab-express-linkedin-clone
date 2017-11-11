var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/signup', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
module.exports = router;
