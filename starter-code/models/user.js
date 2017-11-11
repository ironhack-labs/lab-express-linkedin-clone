const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  summary: String,
  // imageUrl: "https://i.imgur.com/3R3iYvP.jpg",
  company: String,
  jobTitle: String,


});

const User = mongoose.model('User', userSchema);
module.exports = User;
