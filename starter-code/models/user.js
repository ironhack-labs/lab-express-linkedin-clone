// const express = require ('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/li-clone');


const userSchema = new Schema({
  name: {type: String, unique: true},
  password: {type: String},
  email: {type: String},
  summary: {type: String},
  imageUrl: {type: String},
  company: {type: String},
  jobTitle: {type: String}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);


module.exports = User;
