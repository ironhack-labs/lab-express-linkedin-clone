var express = require('express');
var router = express.Router();

const User = require('../models/user');

function auth(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', auth, function(req, res, next) {
  User.find({ posts: { $exists: true, $ne: [] } }, function(err, users){
        if(err){
          next(err);
        } else{
            console.log('user-list', users);
            res.render('home', { title: 'LinkedIn', user: req.session.currentUser, users });
        }
   });
});

module.exports = router;
