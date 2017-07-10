/*jshint esversion: 6 */

const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true},
  password: {type:String, require:true},
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
