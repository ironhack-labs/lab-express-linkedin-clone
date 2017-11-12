const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, require: true},
  email: {type: String, require: true},
  password: {type: String, require: true},
  summary: {type: String},
  imageUrl: {type: String},
  company: {type: String},
  jobTitle: {type: String},
}, {
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
});

const Users = mongoose.model('users', userSchema);
module.exports = Users;
