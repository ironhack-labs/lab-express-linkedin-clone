const mongoose = require('mongoose');
const User = require('../models/user');
const globals = require('../config/globals');

mongoose.connect(globals.dbUrl);

const user = [
  {
    username: 'Yoga',
    password: '1234',
    name: 'Mat',
    description: 'matia@gmail.com',
  },
];

User.create(user, (err, docs) => {
  if (err) {
    throw err;
  }
  docs.forEach(p => console.log(p.name));
  mongoose.connection.close();
});
