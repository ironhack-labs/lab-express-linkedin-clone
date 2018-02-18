const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    summary:String,
    imageUrl:String,
    company:String,
    jobTitle:String
});

module.exports = mongoose.model("User", userSchema);