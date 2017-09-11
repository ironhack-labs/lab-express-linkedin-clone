const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/profile/:id', (req, res, next) => {
	const userSession = req.session.currentUser
	const userId = req.params.id

	User.findById(userId, (err, user) => {
		if (err) return next(err)

		res.render('profiles/show', {
			title: user.name + ' page',
			user: user,
			userSession: userSession
		})
	})
})

router.get('/profile/:id/edit', (req, res, next) => {
	const userId = req.params.id

	User.findById(userId, (err, user) => {
		if (err) return next(err)

		res.render('profiles/edit', { title: 'Edit ' + user.name + ' profile', user: user})
	})
})

router.post('/profile/:id/edit', (req, res, next) => {
	const userId = req.params.id
	const updateProfile = {
		name: req.body.name,
		email: req.body.email,
		imageUrl: req.body.image,
		company: req.body.company,
		jobTitle: req.body.job,
		sumary: req.body.sumary
	}

	User.findByIdAndUpdate(userId, updateProfile, (err, user) => {
		if (err) return next(err)

		res.redirect('/profile/' + userId)
	})
})

module.exports = router;
