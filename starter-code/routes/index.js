var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    res.render('index', {
    title: 'Home Page',
    session:req.session.currentUser
  });
}else{
  res.render('auth/login', {
    title: 'Login Page'
   });
}
});

module.exports = router;
