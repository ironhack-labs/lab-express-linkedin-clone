var express = require('express');
var router = express.Router();

/* render the profile page*/
router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('profile');
  }
    


  });

  module.exports = router;