const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: [true, "Post can't be empty"]
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  user_name: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
