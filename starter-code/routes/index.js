const express = require('express');
const router = express.Router();
// const isLoggedIn = require('../middlewares/isLoggedIn');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Linkedin' });
});



module.exports = router;
