const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  _creator: Schema.Types.ObjectId
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
