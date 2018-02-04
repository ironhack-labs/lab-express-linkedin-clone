var express = require('express');
var router = express.Router();
// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//GET /profile/:userId/edit - This will allow the user to edit their own profile. 
//The user should be redirected to the homepage if they're trying to edit a profile that isn't theirs.
router.get('/profile/:userId/edit', (req,res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
      if (err) { return next(err); }
      res.render('profile/edit', { user: user });
    });
  })

/* CRUD -> UPDATE DATABASE */
router.post('/profile/:userId/edit', (req,res) => {
  const userId = req.params.id;
  const {username,name,email,password,imageUrl,company,jobTittle} = req.body;
  const updates = {username,name,email,password,imageUrl,company,jobTittle};

  Product.findByIdAndUpdate(userId, updates, (err, product) => {
    if (err){ return next(err); }
    return res.redirect('/');
  });
})











module.exports = router;