const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    email: String
  }, 
  {
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at" 
    }
  
});

module.exports = mongoose.model("User", userSchema);