const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/drinkedIn',  {useMongoClient: true});
mongoose.Promise = require('bluebird');

const postSchema = new Schema({
    content: {type: String},
    _creator: {type: String},
}, { timestamps: 
    { createdAt: "created_at", updatedAt: "updated_at" }});

const Post = mongoose.model('post', postSchema);
module.exports = Post;