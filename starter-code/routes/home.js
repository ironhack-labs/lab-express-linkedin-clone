var express = require('express');
var router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

//HOME
router.get('/', isLoggedIn('/login'), (req,res) => {
    res.render('home',{user:req.session.currentUser});
});

module.exports = router;
