const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const Post = require('../models/post');

const userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String,
  posts: [Post.schema]

}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;