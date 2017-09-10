const session = require('express-session')
const mongoose = require('mongoose')
const {dbURL} = require('./config');

module.exports = () => {
  mongoose.connect(dbURL)
    .then( () => console.log('Connected to db!'))
}