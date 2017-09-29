const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name : { type: String, required: [true, 'Please enter the name'] },
  email : { type: String, required: true},
  password : { type: String, required: [true, 'Please enter the password'] },
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;