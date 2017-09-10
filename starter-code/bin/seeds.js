/*jshint esversion: 6 */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linkedIn', {useMongoClient: true});
const User = require('../models/user');

const users = [
  {
    username: 'Sean Bean',
    email: 'Warden of the North',
  },
  {
    name: 'Bugs Bunny',
    email: 'Warden of the North',
  },
  {
    name: 'Charlie Chaplin',
    email: 'Warden of the North',
  },
];

User.create(users, (err, docs) => {
  if (err) {
    throw err;
  }

  docs.forEach((user) => {
    console.log(user.name);
  });
  mongoose.connection.close();
});
