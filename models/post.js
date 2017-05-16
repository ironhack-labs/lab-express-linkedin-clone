const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  nameOfUser: { type: String },
  content: { type: String },
},
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

module.exports = mongoose.model('Post', PostSchema);
