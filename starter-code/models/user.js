const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("./post");

const UserSchema = new Schema(
  {
    username: String,
    name: String,
    email: String,
    password: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String,
    posts: [Post.schema]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
