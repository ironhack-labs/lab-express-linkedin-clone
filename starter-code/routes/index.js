var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = req.session.currentUser;
  if(user){
  console.log("LOGGED")
  res.render('index', {user});
  return;
  } else {
    console.log("NOT LOGGED")
    res.redirect("/login");
  }
});

module.exports = router;
