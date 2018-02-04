const express = require('express');
const router = express.Router();
const User = require('../models/user');

// //GET EDIT
// router.get("/profile/:id/edit",(req,res,next) => {
//   const currentUser = req.session.currentUser;
//   res.render("profiles/edit",{currentUser});
// });

// GET PROFILE 
router.get("/profile/:id", (req,res,next) => {
  const userId = req.params.id;
  const currentUser = req.session.currentUser;

  User.findById(userId).exec().then( user => {
    console.log({currentUser})
    res.render("profiles/show", {user: user, currentUser : currentUser});
  }).catch(e => next(e))
});

module.exports = router;