const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {type: String,required: [true, 'Username can\'t be blank']},
  email: String,
  name: String,
  password: {type: String,required: [true, 'You must have a password']},
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String,
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User= mongoose.model('User', UserSchema);

module.exports= User;
