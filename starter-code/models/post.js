const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  content: {type: String, required: true},
  _creator: {type: String, required: true,}
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

var Post = mongoose.model("Post", postSchema);
module.exports = Post;
