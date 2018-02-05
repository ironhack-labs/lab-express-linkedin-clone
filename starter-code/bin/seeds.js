const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linkedin');

const User = require('../models/user');

const users = [
  {
    username: 'TCruise',
    name: 'Tom Cruise',
    password: '1234',
    email: 'abc@web.de'
  },
  {
    username: 'KKardashian',
    name: 'Kim Kardashian',
    password: '5678',
    email: 'def@web.de'
  }
];

User.create(users, (err, savedUsers) => {
  if (err) { throw err; }

  savedUsers.forEach(theUser => {
    console.log(`${theUser.name} - ${theUser._id}`);
  });
  mongoose.disconnect();
});
