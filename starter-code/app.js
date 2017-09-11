const app = require('express')();
const mongoose     = require('mongoose');
const globals = require('./config/globals');

mongoose.connect(globals.dbUrl);

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

require('./config/express')(app);

const index = require('./routes/index');
const singup = require('./routes/singup');
const login = require('./routes/login');


app.use('/', index);
app.use('/', singup);
app.use('/', login);

require('./config/error-handler')(app);

module.exports = app;
