const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");

//For protect the path
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    res.render('/');
  }else {
    res.render('profile/show',
      {username: req.session.currentUser.username,
       id: req.session.currentUser._id});
  }
});

router.get('/:id', (req, res,next) => {
  let id = req.params.id;
  User.findById(id)
    .then((user) => {
      res.render('/profile/edit');
    }).catch((err) => {
      return next(err);
    });
});

// router.post('/:id', (req, res,next) => {
//   let id = req.params.id;
//   User.findById(id)
//     .then((user) => {
//       res.render('profile/edit');
//     }).catch((err) => {
//       return next(err);
//     });
// });

module.exports = router;
