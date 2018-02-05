const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lab-express-linkedin-clone');

const User = require('../models/user');

const users = [];

User.create(users, (err, savedUsers) => {
  if (err) { throw err; }

  savedUsers.forEach(theUser => {
    console.log(`${theUser.name} - ${theUser._id}`);
  });
  mongoose.disconnect();
});
