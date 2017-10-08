const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username : { type: String, required: [true, 'Please enter the name'] },
  email : { type: String, required: true},
  password : { type: String, required: [true, 'Please enter the password'] },
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String,
});

module.exports = mongoose.model('User', userSchema);
