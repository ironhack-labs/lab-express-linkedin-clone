const express = require('express');
const router = express.Router();
const User = require("../models/User");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LinkedIn' });
});

router.get('/logout',(req,res) => {
  req.session.currentUser = null;
  res.redirect('/');
})

router.get('/update/:id/edit', (req, res) => {
  const userId = req.params.id;
  User.findById(userId, (err, user) => {
      if (err) { return next(err); }
      res.render('update', { user: user });
  });
})


/* CRUD -> UPDATE DATABASE */
router.post('/update/:id/edit', (req, res) => {
  const userId = req.params.id;
  const {username, imageUrl} = req.body;
  const updates =  {username, imageUrl};

  User.findByIdAndUpdate(userId, updates, (err, user) => {
      if (err) { return next(err); }
      return res.redirect('/');
  });
})


module.exports = router;

