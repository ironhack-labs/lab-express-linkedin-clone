const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, min: 5, max: 15 },
  email:String,
  password: { type: String, required: true, min: 5, max: 15 },
  summary:String,
  imageUrl:String,
  company: String,
  jobTitle: String,
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
