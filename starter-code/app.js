const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

const mongoose       = require("mongoose");
const app            = express();
const expressLayouts = require('express-ejs-layouts');

const session = require("express-session");
const MongoStore =require("connect-mongo")(session);

const index = require('./routes/index');
const authentication = require('./routes/authentication');
const profile = require('./routes/profile');
const users = require('./routes/users');

// Controllers

app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
// Mongoose configuration
mongoose.connect("mongodb://localhost/linkedin-clone")

// view engine setup

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Authentication (Debe ir antes de las rutas)

app.use(session({
  secret: "userPage",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));
// Routes

app.use('/', index);
app.use('/authentication', authentication)
app.use("/profile/", profile)
app.use("/users/", users)

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

app.listen(3000, function(err){
  if(err) console.log(err);
  console.log("Tu servidor esta funcionando");
})


module.exports = app;
