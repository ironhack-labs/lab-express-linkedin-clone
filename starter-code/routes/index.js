const express = require('express');
const router = express.Router();
const User = require("../models/User");


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'LinkedIn' });
});

router.get('/logout', (req, res) => {
  req.session.currentUser = null;
  res.redirect('/');
})



router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  console.log(req.params)
  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('update', { user: user, });
    console.log({ user });

  })
});



/* CRUD -> UPDATE DATABASE */
router.post('/user:id', (req, res) => {
  const userId = req.params.id;
  const {username, imageUrl} = req.body;
  const updates =  {username, imageUrl};

  User.findByIdAndUpdate(userId, updates, (err, user) => {
      if (err) { return next(err); }
      return res.redirect('/');
  });
})


module.exports = router;

