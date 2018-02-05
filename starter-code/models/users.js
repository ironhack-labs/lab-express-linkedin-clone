const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;