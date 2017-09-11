const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const user = new Schema ({
	firstName : {type: String,required:"enter your first name."},
	lastName: {type: String,required:"enter your last name."},
	email: {type: String,required:"enter your e-mail adress."},
	password: {type: String,required:"select a password."},
	username: {type: String,required:"select a username."},
	summary: {type: String,required:"provide a summary of your carrer."},
	imageUrl: {type: String,required:"Enter URL-adress for your profile picture."},
	company: {type: String,required:"provide you last employer's name."},
	jobTitle: {type: String,required:"provide your last job title."}
});

const User = mongoose.model('User', user);
module.exports = User;
