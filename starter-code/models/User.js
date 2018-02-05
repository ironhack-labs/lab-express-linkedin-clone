const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String
},{
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

const User = mongoose.model("Users",userSchema);
module.exports = User;