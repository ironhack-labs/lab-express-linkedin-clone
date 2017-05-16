const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mongoose-linkedin');
const User = require('../models/user');



const users = [
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
  {
    name: 'Tom Cruise',
    email: 'tom@tom.com',
    password: 'tom',
    summary: 'sdsdsd',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png',
    company: 'Crazy Horse',
    jobTitle: 'CEO',
  },
];

User.create(users, (err, docs) => {
  if (err) {
    throw err;
  }
  docs.forEach(user => {
    console.log(user.name);
  });
  mongoose.connection.close();
});
