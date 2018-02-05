'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTible: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
