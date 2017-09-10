/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/linkedIn',  {useMongoClient: true});

const UserSchema = new Schema({
  username  : String,
  name      : String,
  email     : String,
  password  : String,
  summary   : String,
  imageUrl  : String,
  company   : String,
  jobTitle  : String
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
