const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const tweetSchema = new Schema({
  tweet: {
    type: String,
    required: [true, "Tweet can't be empty"]
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  user_name: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

var Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
