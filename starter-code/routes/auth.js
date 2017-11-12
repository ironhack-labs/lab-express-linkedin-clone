const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
	res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const name = req.body.name;
	const email = req.body.email;

	if (username === '' || password === '') {
		res.render('auth/signup', {
			errorMessage: 'Indicate a username and password to sign up'
		});
		return;
	}

	User.findOne({'username': username}).then(user => {
		if (user) {
			res.render('auth/signup', {
				errorMessage: 'User already exists'
			});
			return;
		}

		const salt = bcrypt.genSaltSync(bcryptSalt);
		const hashPass = bcrypt.hashSync(password, salt);

		new User({
			username: username,
			password: hashPass,
			name: name,
			email: email
		})
		.save()
		.then(() => res.redirect('/'))
		.catch(e => next(e));
	});
});

router.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ 'username': username }, (err, user) => {
      if (err || !user) {
        res.render('auth/login', {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/home');
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password'
        });
      }
  });
});

router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => res.redirect('/'));
});

module.exports = router;
