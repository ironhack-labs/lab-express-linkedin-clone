'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTible: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
