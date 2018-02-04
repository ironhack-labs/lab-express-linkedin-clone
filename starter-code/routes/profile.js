var express = require('express');
var router = express.Router();
// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//GET /profile/:userId/edit - This will allow the user to edit their own profile. 
//The user should be redirected to the homepage if they're trying to edit a profile that isn't theirs.

router.get('/:userId/edit', (req,res) => {
    const userId = req.params.userId;
    User.findById(userId, (err, user) => {
      if (err) { return next(err); }
      console.log(user);
      res.render('profile/edit', { user });
    });
  })

router.post('/:userId/edit', (req,res) => {
  const userId = req.params.id;
  const {username,name,email,summary,imageUrl,company,jobTitle} = req.body;
  const updates = {username,name,email,summary,imageUrl,company,jobTitle};
  console.log(updates);

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    
    return res.redirect(`/profile/${userId}`);
  });
})

router.get('/:userId', (req,res) => {
    res.render('profile/show');
})











module.exports = router;