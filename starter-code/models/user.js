/*jshint esversion:6*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : { type: String, required: true },
    email : {type: String, required: true},
    password : {type: String, required: true},
    summary : {type: String, required: true},
    imageUrl : {type: String, required: true},
    company : {type: String, required: true},
    jobTittle : {type: String, required: true}
});


const User = mongoose.model("User", userSchema);
module.exports = User;
