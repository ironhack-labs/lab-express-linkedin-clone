const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linkedIn', {useMongoClient: true});
const Users = require('../models/User');

const dateUsers = [
  {
    name: 'Alberto Pedraza Jiménez',
    email: 'alberpedrazaes@gmail.com',
    password:'',
    summary: 'este es el sumario',
    imageUrl:'https://gravatar.com/avatar/449366c34f51f635b4022e1306568d39?s=512&d=https://codepen.io/assets/avatars/user-avatar-512x512-6e240cf350d2f1cc07c2bed234c3a3bb5f1b237023c204c782622e80d6b212ba.png',
    company:'Web development',
    jobTitle: 'Full stack Javascript developer',
  },
  {
    name: 'Alberto Pedraza Jiménez',
    email: 'alberpedrazaes@gmail.com',
    password:'',
    summary: 'este es el sumario',
    imageUrl:'https://gravatar.com/avatar/449366c34f51f635b4022e1306568d39?s=512&d=https://codepen.io/assets/avatars/user-avatar-512x512-6e240cf350d2f1cc07c2bed234c3a3bb5f1b237023c204c782622e80d6b212ba.png',
    company:'Web development',
    jobTitle: 'Full stack Javascript developer',
  },
  {
    name: 'Alberto Pedraza Jiménez',
    email: 'alberpedrazaes@gmail.com',
    password:'',
    summary: 'este es el sumario',
    imageUrl:'https://gravatar.com/avatar/449366c34f51f635b4022e1306568d39?s=512&d=https://codepen.io/assets/avatars/user-avatar-512x512-6e240cf350d2f1cc07c2bed234c3a3bb5f1b237023c204c782622e80d6b212ba.png',
    company:'Web development',
    jobTitle: 'Full stack Javascript developer',
  }
];

Users.collection.drop();

Users.create(dateUsers, (err, docs) => {
  if (err) {
    throw err;
  }

  docs.forEach((dateUsers) => {
    console.log(dateUsers.name);
  });

  mongoose.connection.close();
});
