const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String
  }, 
  {
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at" 
    }
  
});

module.exports = mongoose.model("User", userSchema);