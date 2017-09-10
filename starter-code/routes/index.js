const express = require('express');
const router  = express.Router();
const User    = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({}, (err, users) => {
    if (err) { return next(err); }
    res.render('home', { title: 'Linkedin', users: users});
  });
});

module.exports = router;
