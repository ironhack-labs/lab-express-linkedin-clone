const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    summary: String,
    imgURL: String,
    company: String,
    jobTitle: String, 
    following: [{ type: Schema.Types.ObjectId, ref: "User" }]
    }, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
});

const User = mongoose.model('User', userSchema);
module.exports = User;