// models/campaign.js
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const moment = require('moment');

const PostSchema = new Schema({
  title         : { type: String, required: true },
  description   : { type: String, required: true },
  creator      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post   : { type: String, required: 0 },
  photo: String
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
