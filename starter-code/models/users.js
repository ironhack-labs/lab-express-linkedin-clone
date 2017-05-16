const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;


// name - User's name
// email - User's email
// password - Encrypted password with BCrypt
// summary - User's summary: where he has worked, how many years...
// imageUrl - Upload your user profile picture to imgur and use the public link to show the image in our LinkedIn
// company - User's current company
// jobTitle - User's current Job Title
