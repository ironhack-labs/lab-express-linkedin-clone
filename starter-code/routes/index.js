var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Home' });
  res.render('authentication/login');
});

router.get('/private', function(req, res, next) {
  if(req.session.currentUser){
      res.render('private', { title: 'Private' });
  }
  res.redirect('http://google.com');
});

module.exports = router;
