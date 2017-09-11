const mongoose = require('mongoose');
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/drinkedIn',  {useMongoClient: true});
mongoose.Promise = require('bluebird');

const userSchema = new Schema({
    username: {type: String},
    name: {type: String},
    email: {type: String},
    password: {type: String},
    summary: {type: String},
    imageUrl: {type: String},
    company: {type: String},
    jobTitle: {type: String},
});

const User = mongoose.model('user', userSchema);
module.exports = User;