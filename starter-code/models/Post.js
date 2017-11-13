const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  username: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
