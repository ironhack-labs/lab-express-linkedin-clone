const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linkedin-clone');

const User = require('../models/user');

const users = [
  {
    name: 'Derrick Thompson',
    username: 'D2daT',
    email: 'd2dat@fuckface.com',
    password: 'ReallySECURE',
    summary: 'I like cheese',
    imageUrl: 'TBF',
    company: 'El Corte Ingles',
    jobTitle: 'Fluffer'
  },
  {
    name: 'George Osborne',
    username: 'Jimbo',
    email: 'jimbo@hotmule.com',
    password: 'ReallySECURE',
    summary: 'I like mules',
    imageUrl: 'TBF',
    company: 'El Corte Ingles',
    jobTitle: 'Fluffer'
  },
  {
    name: 'Denise Pearl Jones',
    username: 'DP_daily',
    email: 'theone@geemail.com',
    password: 'ReallySECURE',
    summary: 'I hat heloo',
    imageUrl: 'TBF',
    company: 'El Corte Ingles',
    jobTitle: 'Fluffer'
  },
  {
    name: 'Katy Thompson',
    username: 'looloo',
    email: 'woo@mmm.com',
    password: 'ReallySECURE',
    summary: 'I like ham',
    imageUrl: 'TBF',
    company: 'John Lewis',
    jobTitle: 'Accountant'
  }
];

User.create(users, (err, regUsers) => {
  if (err) { throw err; }

  regUsers.forEach(theUser => {
    console.log(`${theUser.name} - ${theUser._id}`);
  });
  mongoose.disconnect();
});
