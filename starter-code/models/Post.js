const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  title: String,
  _creator: String

});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
