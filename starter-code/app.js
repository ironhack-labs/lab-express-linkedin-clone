const app = require('express')();
const globals = require('./config/globals');
const mongoose = require('mongoose');

//conexion
mongoose.connect(globals.dbUrl);
//config express
require('./config/express')(app);
//Requerir Rutas
const index = require('./routes/index');
const users = require('./routes/users');

// default value for title local
app.locals.title = 'Express -DE-Linkedin-Clone';

//usar rutas
app.use('/', index);
app.use('/users', users);
//gestion errores
require('./config/error-handler')(app);

module.exports = app;
