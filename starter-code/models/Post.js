const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: String,
    _creator: Object,
  },
  {
    timestamp: {
      createdAt: 'created_at',
      updatedAt: 'update_at',
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
