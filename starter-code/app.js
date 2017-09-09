const app = require('express')();
const mongoose     = require('mongoose');
const globals = require('./config/globals');

mongoose.connect(globals.dbUrl);

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

require('./config/express')(app);

const index = require('./routes/index');
app.use('/', index);

require('./config/error-handler')(app);

module.exports = app;
