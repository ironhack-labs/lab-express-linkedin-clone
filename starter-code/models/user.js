const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // Username...
  username: {
    type: String,
    required: [true, 'Please enter your username']
  },
  // User's name
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  // User's email
  email: {
    type: String,
    required: [true, 'Please enter your email']
  },
  // Encrypted password with BCrypt
  password: {
    type: String,
    required: [true, 'Please enter your password']
  },

  // User's summary: where he has worked, how many years...
  summary: {
    type: String,
    required: [true, 'Please enter a summary']
  },
  // Upload your user profile picture to imgur and use the public link to show the image in our LinkedIn
  imageUrl: {
    type: String,
  },
  // User's current company
  company: {
    summary: {
      type: String,
    },
  },
  // User's current Job Title
  jobTitle: {
    type: Sting,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
