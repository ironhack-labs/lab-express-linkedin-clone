const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: [true, 'You need a real name'] },
  email: { type: String, required: [true, 'Email'] },
  password: { type: String, required: [true, 'You need a password'] },
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String

}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
