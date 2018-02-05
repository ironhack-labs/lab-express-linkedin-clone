var express = require('express');
var router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    }
    res.render('users/users', {
      title: 'Users',
      users
    });
  });
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(404);
      const data = {
        title: '404 Not Found'
      };
      return res.render('not-found', data);
    }
    const data = {
      title: user.name,
      user
    };
    res.render('users/detail', data);
  });
});

router.get('/:id/edit', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }

  const id = req.params.id;
  // if (req.session.currentUser_id !== req.params.id) {
  //   return res.redirect('/users');
  // }

  User.findById(id, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(404);
      const data = {
        title: '404 Not Found'
      };
      return res.render('not-found', data);
    }

    if (req.session.currentUser._id === req.params.id) {
      const data = {
        title: 'Edit ' + user.name,
        user
      };
      res.render('users/edit', data);
    }
    res.render('users');
  });
});

router.post('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  const id = req.params.id;
  const updates = {
    $set: {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      summary: req.body.summary,
      imageUrl: req.body.imageUrl,
      company: req.body.company,
      jobTitle: req.body.jobTitle
    }
  };
  User.update({_id: id}, updates, (err, result) => {
    if (err) {
      return next(err);
    }
    if (!result.n) {
      res.status(404);
      const data = {
        title: '404 Not Found'
      };
      return res.render('not-found', data);
    }
    res.redirect('/users');
  });
});

module.exports = router;
