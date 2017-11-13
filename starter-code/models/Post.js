const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: [true, "Post can't be empty"]
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  creatorName : String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

var Post = mongoose.model("Post", postSchema);
module.exports = Post;
