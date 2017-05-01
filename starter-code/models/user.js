/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true,'Plsea enter your name']
  },
  email: {
    type: String,
    required: [true,'Plsea enter your email']
  },
  password: {
    type: String,
    required: [true,'Plsea enter your password']
  },
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String
});

const User = mongoose.model("User", userSchema);
module.exports = User;
