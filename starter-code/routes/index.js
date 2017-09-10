var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.redirect('/login')
});

router.get('/login', function(req, res, next) {
  res.render('login')
})

module.exports = router;


//If the user hasn't started a session, he should be redirected to /login page.
