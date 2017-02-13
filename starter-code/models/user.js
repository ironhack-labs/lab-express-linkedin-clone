/* jshint esversion:6 */

const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String
});

const User = mongoose.model("User", userSchema);
module.exports = User;
