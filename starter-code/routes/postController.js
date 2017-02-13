const express        = require("express");
const postController = express.Router();
const User           = require("../models/user");
const Post           = require("../models/post");

postController.post("/posts/:userId/new", (req, res, next) => {

	var content = req.body.status;
	var _creator = req.params.userId;

	var newPost = Post({
		content,
		_creator
	});

	newPost.save((err) => {
		if (err) {
			res.render("auth/signup", {
				errorMessage: "Something went wrong when signing up"
			});
		} else {
			var profilePage = "/profile/" + req.params.userId;
			res.redirect(profilePage);
		}
	});

});

module.exports = postController;
