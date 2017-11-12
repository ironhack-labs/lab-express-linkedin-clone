const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema for each user document
const userSchema = new Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    summary: String,
    imageUrl: String,
    company: String,
    jobTitle: String,
  },
  {
    timestamp: {
      createdAt: 'created_at',
      updatedAt: 'update_at',
    }
});

// User model for 'users' db collection
const User = mongoose.model('User', userSchema);

// Make User model available
module.exports = User;
