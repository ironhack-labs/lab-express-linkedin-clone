const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET PROFILE 
router.get("/profile/:id", (req,res,next) => {
  const userId = req.params.id;
  let currentUser = req.session.currentUser;
  
  User.findById(userId).exec().then( user => {
    console.log({currentUser})
    res.render('profiles/show', {user: user, currentUser : currentUser});
    
    // if (currentUser){
    //   res.render('profiles/show', {user: user}, {currentUser});
    //   return;
    // } else{
    //   res.render('profiles/show', {user: user});
    // }
  }).catch(e => next(e))
});

module.exports = router;