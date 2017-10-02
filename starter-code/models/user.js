const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	summary: String,
	imageUrl: String,
	company: String,
	jobTitle: String,
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
})

const User = mongoose.model('User', userSchema)
module.exports = User