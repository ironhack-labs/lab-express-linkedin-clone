var express = require('express');
var router = express.Router();

/* GET main home page. */
router.get('/', function(req, res, next) {
  if (req.session.currentUser){
    res.redirect("/welcome");
  }
  res.render('index', { title: 'LinkedIn' });
});

router.get('/welcome', function(req, res, next) {
  res.render("welcome");
});

module.exports = router;