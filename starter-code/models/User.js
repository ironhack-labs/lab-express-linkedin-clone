/* jshint esversion: 6, node: true */
'use strict';

const mongoose       = require ('mongoose');
const Schema         = mongoose.Schema();

const userSchema  = new Schema({
  userName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  summary:  {
    type: String
  },
  imageUrl: {
    type: String
  },
  company:  {
    type: String
  },
  jobTitle: {
    type: String
  }
});
