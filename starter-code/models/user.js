const mongoose = require('mongoose');
const Schema = mongoose.Schema; // This must be part of mongoose's functionality.

const userSchema = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;
