const router = require('express').Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Linkedin Clone' });
});

module.exports = router;
