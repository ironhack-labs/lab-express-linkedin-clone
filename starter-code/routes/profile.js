const express = require('express');
const User = require('../models/User');

const router  = express.Router();

router.get('/', (req, res, next) => {
  User.find({}, (err, User) => {
    if (err) { return next(err) }
    res.render('profile/index', {
      User: User
    });
  });
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id

  User.findById(id, (err, User) => {
    res.render('profile/index', {
      User: User
    })
  })
});

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id

  User.findById(id, (err, User) => {
    res.render('profile/edit', {
      User: User
    })
  })
});

router.post('/:id', (req, res, next) => {
  let id = req.params.id

  const updates = {
    name: req.body.name,
    email: req.body.email,
    imageUrl: req.body.imageUrl,
    summary: req.body.summary,
    company: req.body.company,
    jobTitle: req.body.jobTitle
  };

  User.findByIdAndUpdate(id, updates, (err, User) => {
    if (err){ return next(err); }

    return res.redirect(`/profile/${User._id}`);
  });
});

module.exports = router;
