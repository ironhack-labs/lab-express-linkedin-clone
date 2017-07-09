const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/User');
/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, (err, u) => {
    console.log(u);
    res.render('users/showAll', {
      title: 'Nuestros usuarios',
      user: u
    });
  });
});

router.get('/:id/edit', function(req, res, next) {
  console.log("sesion id: " + req.session.currentUser._id);
  console.log("params id: " + req.params.id);
  console.log("golaada");
  if (req.session.currentUser._id === req.params.id) {
    User.findById(req.params.id, (err, u) => {
      if (err) {
        console.log(err);
      }
      res.render('users/edit', {
        title: 'Edit your profile',
        user: u
      });
    });
  } else {
    res.redirect('/');
  }
});

router.post('/:id', function(req, res, next) {
  console.log("hola");

    let updates = {
      name: req.body.name,
      email: req.body.email,
      job: req.body.job,
      company: req.body.company,
      summary: req.body.summary,
      imageUrl: req.body.imageUrl
    };
    let id = req.params.id;
    console.log(req.params);
    User.findByIdAndUpdate(req.params.id, updates, (err, p) => {
      if(err){
        console.log("fallo");

      }
      res.redirect(`/`);
    });
});

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  User.findById(req.params.id, (err, u) => {
    if (err) {
      console.log(err);
    }
    res.render('users/show', {
      title: 'User info',
      user: u,
      session: req.session.currentUser
    });
  });
});





module.exports = router;
