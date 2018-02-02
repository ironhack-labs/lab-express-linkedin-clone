const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: String,
    username: String,
    email: String,
    password: String,
    summary: String,
    imageurl: String,
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