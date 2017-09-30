const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String
}, {
    timestamps: {
        createdAt: "created_at",
        updateAt: "update_at"
        }
})

const User = mongoose.model("User", userSchema);

module.exports = User;