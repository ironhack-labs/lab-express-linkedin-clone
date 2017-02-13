const express        = require("express");
const profileController = express.Router();
const User           = require("../models/user");

profileController.get("/profile/:userId/edit", (req, res, next) => {
	let profileData = {
		auth: req.session.currentUser,
		profileName: req.params.userId,
		email: req.session.currentUser.email,
		summary: req.session.currentUser.summary,
		imageURL: req.session.currentUser.imageURL,
		company: req.session.currentUser.company,
		jobTitle: req.session.currentUser.jobTitle
	}
  res.render("profile/edit",profileData);
});

profileController.post("/profile/:userId", (req, res) => {
	let profileData = {
		auth: req.session.currentUser,
		profileName: req.params.userId,
		email: req.body.email,
		summary: req.body.summary,
		imageURL: req.body.imageURL,
		company: req.body.company,
		jobTitle: req.body.jobTitle
	}

	const profileToUpdate = {
			email: req.body.email,
			summary: req.body.summary,
			imageUrl: req.body.imageUrl,
			company: req.body.company,
			jobTitle: req.body.jobTitle
	};

	User.findOneAndUpdate({ "username": req.params.userId }, profileToUpdate, (err, user) => {
		if (err){ return next(err); }
		// req.session.currentUser = user;
		return res.render("profile/show",profileData);
	});
});

module.exports = profileController;
