const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String
}, {
        timestamps:
            {
                createdAt: "created_at",
                updatedAt: "updated_at"
            }
    });

const User = mongoose.model('User', UserSchema);
module.exports = User;