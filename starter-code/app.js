const app = require('express')();
const mongoose = require('mongoose');
const globals = require('./config/globals');

mongoose.connect(globals.dbUrl)
  .then( () => console.log("Connected to db!"));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

require('./config/express')(app);

// const index = require('./routes');
// app.use('/', index);

const user = require('./routes/users');
app.use('/', user);

require('./config/error-handler')(app);

module.exports = app;
