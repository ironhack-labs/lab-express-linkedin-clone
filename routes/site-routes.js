const express = require('express');
const bcrypt = require('bcrypt');

const siteRoutes = express.Router();

const bcryptSalt = 10;
const User = require('../models/user');

/*siteRoutes  .use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
});*/

// profile/:id/ is public profile page
siteRoutes.get('/:id/', (req, res, next) => {
  const userId = req.params.id;
  User.findOne({ _id: userId }, (err, user) => {
    res.render('profile/show', { user });
  });
});

// profile/:id/edit is private profile page
siteRoutes.get('/:id/edit', (req, res, next) => {
  const userId = req.params.id;
  User.findOne({ _id: userId }, (err, user) => {
    res.render('profile/edit', { user });
  });
});

siteRoutes.post('/:id/edit', (req, res, next) => {
  const userId = req.params.id;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  const updates = {
    name: req.body.name,
    email: req.body.email,
    // password: req.body.password, // stores without hash, need to fix!
    summary: req.body.summary,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
  };
  const updatedUser = new User(updates);

  const query = { _id: userId };
  User.findOneAndUpdate(query, updates, (err) => {
    if (err) {
      console.log(userId);
      return res.render(`/${userId}/edit`, { errors: err.errors, user: updatedUser });
    }
    return res.redirect(`/profile/${userId}`);
  });
});

module.exports = siteRoutes;
