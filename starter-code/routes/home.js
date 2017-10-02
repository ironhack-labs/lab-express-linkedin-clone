var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {


	res.render('home', { username });
});

module.exports = router;