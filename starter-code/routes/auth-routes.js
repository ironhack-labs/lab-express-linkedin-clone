const express = require('express');
const User = require('../models/user');

const authRouter = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user-auth');
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

authRouter.get('/', (req, res, next) => {
	res.render('index', { title: "Ironhack LinkedIn"});
});

// sighup 
authRouter.get('/signup', function(req, res, next) {
	res.render('auth/signup');
});


authRouter.post("/signup", (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const summary = req.body.summary;
	const image = req.body.image;
	const company = req.body.company;
	const jobTitle = req.body.jobTitle;

	if (username === "" || password === "") {
		res.render("auth/signup", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}

	User.findOne({ "username": username }, 
		"username", (err, user) => {
		if (user !== null) {
			res.render("auth/signup", {
				errorMessage: "The username already exists"
			});
			return;
		}

		var salt     = bcrypt.genSaltSync(bcryptSalt);
		var hashPass = bcrypt.hashSync(password, salt);

		var newUser = new User({
			username,
			email,
			password: hashPass,
			summary,
			image,
			company,
			jobTitle
		});

		newUser.save((err) => {
			if (err) {
				res.render("auth/signup", {
					errorMessage: "Something went wrong when signing up",
					newUser: newUser
				});
			} 
			res.render('home');
		});
	});
});//end of authRouter.post("/signup")


//login
authRouter.get('/login', (req, res, next) => {
	res.render('auth/login');
});

authRouter.post('/login', (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	if (username === "" || password === "") {
		res.render("auth/login", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}

	User.findOne({ "username": username }, (err, user) => {
			if (err || !user) {
				res.render("auth/login", {
					errorMessage: "The username doesn't exist"
				});
				return;
			}
			if (bcrypt.compareSync(password, user.password)) {
				// Save the login in the session!
				req.session.currentUser = user;
				res.render("home");
			} else {
				res.render("auth/login", {
					errorMessage: "Incorrect password"
				});
			}
	});
});


authRouter.get('/home', ensureAuthenticated, (req, res) => {
	res.render('home', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next(); 
	} else {
		res.redirect('/login')
	}
}

module.exports = authRouter;
