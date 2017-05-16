const express        = require("express");
const siteController = express.Router();
const User           = require("../models/user");
const Post           = require("../models/post");

siteController.get("/profile/:userId", (req, res, next) => {

	var profileData = {
		posts : []
	};

	if (req.session.currentUser) {

		Post.find({"_creator" : req.params.userId}, (err, userPosts) => {

			userPosts.reverse().forEach((post) => {
				profileData.posts.push(post);
			});

		})

		User.findOne({username : req.params.userId}, (err, userInfo) => {

			profileData.auth = req.session.currentUser;
			profileData.profileName = req.params.userId;
			profileData.email = userInfo.email;
			profileData.summary = req.session.currentUser.summary;
			profileData.imageURL = req.session.currentUser.imageURL;
			profileData.company = req.session.currentUser.company;
			profileData.jobTitle = req.session.currentUser.jobTitle;

			res.render("profile/show",profileData);

		})

	}
	else {
		User.findOne({username : req.params.userId}, (err, userInfo) => {
			let profileData = {
				auth: req.session.currentUser,
				profileName: req.params.userId,
				email: userInfo.email
			}

		  res.render("profile/show",profileData);
		})
	}

});

siteController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else {
		res.redirect("/login");
	}
});

siteController.get("/home", (req, res, next) => {
	let data = {
		user: req.session.currentUser
	}

  res.render("home",data);
});

siteController.get("/", (req, res, next) => {
	res.redirect("/home");
});

module.exports = siteController;
