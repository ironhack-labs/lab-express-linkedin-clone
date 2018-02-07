const express = require('express');
const User = require('../models/users');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  User.find()
    .then((usersProfiles) => {
      res.render('profiles/index', {usersProfiles});
    })
    .catch(err => {
      return next(err);
    });
});
/* GET /profile/:userId/edit */
router.get('/:id/edit', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const userID = req.params.id;
  User.findById(userID)
    .then((result) => {
      let data = {
        id: result.id,
        username: result.name,
        email: result.email,
        password: result.password,
        name: result.name,
        summary: result.summary,
        imageUrl: result.imageUrl,
        company: result.company,
        jobTitle: result.jobTitle
      };
      res.render('profiles/edit', data);
    }).catch(err => {
      return next(err);
    });
});

/* POST /profile/:userId */

/* GET /profile/:userId */
router.get('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }
  const userId = req.params.id;
  User.findById(userId)
    .then((result) => {
      let data = {
        id: result.id,
        username: result.name,
        email: result.email,
        password: result.password,
        name: result.name,
        summary: result.summary,
        imageUrl: result.imageUrl,
        company: result.company,
        jobTitle: result.jobTitle
      };
      res.render('profiles/show', data);
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;
