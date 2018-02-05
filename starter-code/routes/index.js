var express = require('express');
var router = express.Router();

/* GET main home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LinkedIn' });
});

// // get the signup page
// router.get('/signup', function(req, res, next) {
//   res.render('./authentication/signup');
// });

// // post (signup page)
// // router.post('/signup', function(req, res, next) {
// //   res.render('index', { title: 'LinkedIn' });
// // });

// // get the login page
// router.get('/login', function(req, res, next) {
//   res.render('./authentication/login');
// });

// // post (login page)
// // router.post('/login', function(req, res, next) {
// //   res.render('index', { title: 'LinkedIn' });
// // });

module.exports = router;
