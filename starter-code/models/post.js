/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/linkedIn',  {useMongoClient: true});

const PostSchema = new Schema({
  content    : String,
  creator    : String,
});

const Post = mongoose.model('post', PostSchema);
module.exports = Post;
