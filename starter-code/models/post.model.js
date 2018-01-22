const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, `Post can't be empty`]
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, `Post needs an user`]
    },
    username: {
        type: String,
        required: [true, `Post needs an username`]
    },
}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);
module.exports = Post;