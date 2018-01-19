const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Post needs a content'],
    unique: true
  },
  _creator: {
      type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, `Post needs an user`]
          }
      ],
      default: []
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;