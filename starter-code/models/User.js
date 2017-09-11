const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true},
  email: {
    type: String,
    unique: [true, `This email already exits`]},
  password: {
    type: String,
    required: true},
  summary: String,
  imageUrl: String,
  company: String,
  jobTitle: String
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('User', userSchema)
