const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true},
  summary: { type: String},
  imageUrl: { type: String},
  company: { type: String},
  jobTitle: { type: String},
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
