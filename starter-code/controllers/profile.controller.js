const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.edit = (req,res,next) =>{
    const session = req.session.currentUser;
    console.log(req.params.userId);
    User.findById(req.params.userId).then((user) => {
   //   console.log(session);
      res.render('profile/edit', {
        user: user,
        session: session
      });
    }).catch(error => next(error));
  } 

  module.exports.show = (req,res,next) =>{
    const session = req.session.currentUser;
    console.log(req.params.userId);
    User.findById(req.params.userId).then((user) => {
    //  console.log(session);
      res.render('profile/show', {
        user: user,
        session: session
      });
    }).catch(error => next(error));
  } 

module.exports.update = (req,res,next) =>{
    const session = req.session.currentUser;
  //  console.log(req.params);
    User.findByIdAndUpdate( req.params.userId,
        {$set: {
        company: req.body.company,
        imageUrl: req.body.imageUrl,
        jobTitle: req.body.jobTitle,
        summary: req.body.summary
         }},
     { 'new': true} ).then((user) => {
    //  console.log(user);
      res.render('profile/show', {
        user: user,
        session: session
      });
    }).catch(error => next(error));
}