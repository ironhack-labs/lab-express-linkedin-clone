const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    password:String,
    name: String, 
    email: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String,
    connections :[]
});

module.exports = mongoose.model("User", userSchema);