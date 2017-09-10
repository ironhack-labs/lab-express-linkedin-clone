const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const Post    = require("../models/Post");

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({})
  .then( (response) => {
    Post.find({})
    .then( (a) => {
      console.log(a)
      res.render('home', { title: 'Linkedin', users: response, posts:a});
    }).catch( err => { next(err) })
  }).catch( err => { next(err) })

});

module.exports = router;
