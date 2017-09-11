const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema ({
  name: String,
  email: String,
  password: String,
  summary: String,
  imageURL: String,
  company: String,
  jobTitle: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
