const express = require("express");
const router = express.Router();
const canGo = require('../middlewares/canGo');
// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/:userId',canGo, (req, res, next) => {
  User.findById(req.params.userId, (err, item) => {
    if (err) {
      return next(err);
    }
    res.render("profile/show", {item: item});
  });
});

router.get('/:userId/edit',canGo, (req, res, next) => {
  User.findById(req.params.userId, (err, item) => {
    if (err) {
      return next(err);
    }
    res.render("profile/edit", {item: item});
  });
});

router.post('/:userId', canGo, (req, res, next) => {
  const productId=req.params.userId;
  let dataUpdate ={
    name:req.body.name,
    email:req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  };

console.log("--------"+JSON.stringify(dataUpdate));
  User.findByIdAndUpdate(productId,dataUpdate,(err,data)=>{
    if(err){
      return next(err);
    }
    return res.redirect('/home');
  });
});

module.exports = router;
