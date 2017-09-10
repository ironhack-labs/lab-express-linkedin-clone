const app = require('express')();
const globals = require('./config/globals');
const mongoose = require('mongoose');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

//conexion a bd
mongoose.connect(globals.dbUrl).then( () => console.log("Connected to db!"));

//config express
require('./config/express')(app);

//gestionar sesiones
app.use(session({
secret: "basic-auth-secret",
cookie: { maxAge: 60000 },
store: new MongoStore({
  mongooseConnection: mongoose.connection,
  ttl: 24 * 60 * 60 // 1 day
})
}));

//Requerir Rutas
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');

// default value for title local
app.locals.title = 'Express -DE-Linkedin-Clone';

//usar rutas
app.use('/', homeRouter);
app.use('/', authRouter);

//gestion errores
require('./config/error-handler')(app);

module.exports = app;
