var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('HOLA, ENTRO EN INDEX');
  //  If user is logged
  // => Show Welcome message "Welcome" <user>
  //  Else
  // => Redirect to login page
  res.render('home', { title: 'HOME - Linkedin' });
});

module.exports = router;
