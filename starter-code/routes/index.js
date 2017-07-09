const express = require('express');
const router = express.Router();
const User = require('../models/User');
/* GET home page. */

router.get('/', function(req, res, next) {
  console.log(req.session.currentUser);
  if (req.session.currentUser) {
    User.find({}, (err,users) => {
      var posts = [];
      users.forEach(function (user) {
        posts.push(user.posts);
      });
      console.log(posts);
      res.render('index', {
      title: 'Home Page',
      session:req.session.currentUser,
      posts: posts
    });

  });
}else{
  res.render('auth/login', {
    title: 'Login Page'
   });
}
});

module.exports = router;
