const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name : String,
  email : String,
  user: String,
  summary : String,
  company: String,
  jobTitle: String,
  imageUrl : String,
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
})

module.exports = mongoose.model("User", userSchema);
