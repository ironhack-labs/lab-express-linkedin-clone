const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  email: { type: String, required: [true, 'Please enter the an email address'] },
  password: { type: String, required: [true, 'Please enter a password'] },
  summary: { type: String },
  imageUrl: { type: String },
  company: { type: String },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  jobTitle: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('User', UserSchema);
