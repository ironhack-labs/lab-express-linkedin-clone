const express = require('express');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const session = require('express-session')
const saltRounds = 15
const router = express.Router();

router.get('/', (req, res, next) => {
	console.log(req.session.currentUser)
	if (req.session.currentUser) return res.render('auth/home')
	res.render('auth/login')
})

router.get('/signup', (req, res, next) => {

	res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
	//const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName

	if (email === "" || password === "") {
		res.render("auth/signup", {
			errorMessage: "Please fill all the fields to signup"
		});
		return;
	}

	User.findOne({ "email": email }, "email", (err, mail) => {
		if (mail !== null) {
			res.render("auth/signup", {
				errorMessage: "This email already exists"
			});
			return;
		}
		const salt = bcrypt.genSaltSync(saltRounds);
		const hashPass = bcrypt.hashSync(password, salt);

		const newUser = User({
			email: email,
			password: hashPass
		});

		newUser.save((err) => {
			if (err) {
				res.render("auth/signup", {
					errorMessage: "Something went wrong when signing up"
				});
			} else {
				res.redirect('/')
			}
		});
	});
})

router.get('/login', (req, res, next) => {
	res.render('auth/login')
})

router.post('/login', (req, res, next) => {
	const password = req.body.password;
	const email = req.body.email;


	if (email === "" || password === "") {
		return res.render("auth/login", {
			errorMessage: "Please fill both fields to login"
		});
	}

	User.findOne({ "email": email }, (err, mail) => {
		if (!mail || !bcrypt.compareSync(password, mail.password)) {
			return res.render("auth/login", {
				errorMessage: "Invalid email/password combination"
			});
		};
		req.session.currentUser = mail;
		res.redirect("/");
	})
})

router.get('/logout', (res, req, next) => {
	res.render('/')
})


module.exports = router;