const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String

});

module.exports = mongoose.model("User", UserSchema);
