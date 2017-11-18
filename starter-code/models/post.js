const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  content: String,
  _creator: {type: String, required: true,}
});

var Post = mongoose.model("Post", postSchema);
module.exports = Post;
