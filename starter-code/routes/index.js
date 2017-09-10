var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.currentUser){
    res.render('index',{
      user: req.session.currentUser.name
    });
  }else{
    res.render('index',{
      user: 'not login'
    });
  }
});

module.exports = router;
