const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/:Id', (req, res, next) => {
  User.findById(req.params.Id, (err, item) => {
    if (err) {
      return next(err);
    }
    res.render("profile/show", {item: item});
  });
});

router.get('/:Id/edit', (req, res, next) => {
  User.findById(req.params.Id, (err, item) => {
    if (err) {
      return next(err);
    }
    res.render("profile/edit", {item: item});
  });
});

router.post('/:Id', (req, res, next) => {
  const productId=req.params.Id;
  let dataUpdate ={
    username:req.body.username,
    email:req.body.email,
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  };


  User.findByIdAndUpdate(productId,dataUpdate,(err,data)=>{
    if(err){
      return next(err);
    }
    return res.redirect('/home');
  });
});

module.exports = router;
