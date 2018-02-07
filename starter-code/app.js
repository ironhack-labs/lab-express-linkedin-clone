//importando módules
//app ppal
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
//leer/interpretar cookies  - OJO SE CONFIGURA ABAJO
const cookieParser = require("cookie-parser");
//LEE LA INFO DE FORMS POST
const bodyParser = require("body-parser");
//CREACION DE COOKIES
const session = require("express-session");
//APP PARA BBDD
const mongoose = require("mongoose");
//MANDA LA SESIÓN/COOKIE A LA BBDD
const MongoStore = require("connect-mongo")(session);
//CONFIG bbdd
const { dbUrl } = require("./config");
//CONECTA LA BBDD
mongoose.connect(dbUrl).then(() => console.log("db running"));
//ROUTES O CONTROLLERS O MODELO DE NEGOCIO
const index = require("./routes/index");
const users = require("./routes/users");
const signup = require('./routes/signup');
const login = require('./routes/login');
const edit = require('./routes/edit');


//APP DE LOGUEO
const passportConfig = require('./passport')
//REQUIRE DE MARC PARA COMPROBASR SI ESTAMOS CONECTADOS
const isLoggedIn = require('./middlewares/isLoggedIn');
//app
const app = express();

// view engine setup - INIT VISTAS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//config cookies IMPORTANTE
app.use(session ({
  secret: 'linkedin-clone',
  resave: true,
  saveUninitialized: true,
  //ENVÍO A LA BBDD DE LA SESSION
  store: new MongoStore({
    mongooseConnection: mongoose.connection, 
    ttl: 24 * 60 * 60
  })
}));

//MIDDLEWARES
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//passport config
passportConfig(app);

//locale VARIABLES DE LA APP - IMPORTANTE
app.use((req, res, next) => {
  //ESTO PERMITE TENER DISPONIBLE EL CURRENT USER EN TODA LA APP
  res.locals.user = req.user;
  res.locals.title = 'Twitter clone';
  next();
});

//MIDDLEWARES DE LAS RUTAS - SIN ESTO NO HAY CHICHA
app.use("/", index);
app.use("/users", users);
app.use('/signup', signup);
app.use('/login', login);
app.use("/edit", edit)

//ERRORES GENÉRICOS
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
