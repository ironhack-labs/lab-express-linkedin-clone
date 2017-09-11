const express = require('express');
const router  = express.Router();
const User    = require("../models/user");
const Post    = require("../models/Post");
const moment = require("moment");


/* GET home page. */
router.get('/', function(req, res, next) {
  const profileSession = req.session.currentUser;

  User.find({})
  .then( (response) => {
    Post.find({})
    .then( (posts) => {
      res.render('home', { title: 'Linkedin', users: response, posts:posts , moment, profileSession:profileSession });
    }).catch( err => { next(err) })
  }).catch( err => { next(err) })

});

module.exports = router;
