const express        = require("express");
const profController = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const isLoggedIn = require('../middlewares/isLoggedIn');


// SHOW
profController.get('/:id', (req, res, next) => {
  const profileId = req.params.id;

  User.findById(profileId)
  .then( (response) => {
    res.render('./profiles/show',{title: 'Details', personInfo: response});
  }).catch( err => next(err) )
});

profController.get('/:id/edit', isLoggedIn('/'), (req,res) => {
  const profileId = req.params.id;
  const profileSessionId = req.session.currentUser._id;

  if( profileSessionId == profileId){
    User.findById(profileId)
    .then( (response) => {
      res.render('./profiles/edit',{title: 'Details', personInfo: response, user:req.session.currentUser});
    }).catch( err => next(err) )
  }else{
    console.log('No es tu sesion')
  }

});

// UPDATE
profController.get('/:id/edit', (req, res, next) => {
  const profileId = req.params.id;

  User.findById(profileId)
  .then( (response) => {
    res.render('./profiles/edit',{title: 'Details', personInfo: response});
  }).catch( err => next(err) )
});

profController.post('/:id/edit', (req, res, next) => {
  const profileId = req.params.id;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  const updates = {
        username: req.body.username,
        password: hashPass,
        name: req.body.name,
        email: req.body.email,
        summary: req.body.summary,
        company: req.body.company,
        jobTitle: req.body.jobTitle
  };

  User.findByIdAndUpdate(profileId, updates, (err, product) => {
    if (err){ return next(err); }
    return res.redirect(`/profile/${profileId}`);
  });
});




module.exports = profController;
