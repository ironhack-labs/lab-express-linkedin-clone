const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);
const express = require('express');
const app = express();
const path = require('path');
// const favicon      =  require('serve-favicon');

const logger = require('morgan');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
// Access POST params with body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Users", {useMongoClient: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//Controllers
const index = require('./routes/index.js');
// const users = require('./routes/users');
const logIn = require('./routes/logIn');
const register = require('./routes/register');
const welcome = require('./routes/welcome');

// Middlewares configuration
app.use(logger('dev'));
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// Authentication
app.use(cookieParser());


//routes
app.use('/', index);
// app.use('/users', users);
app.use('/', logIn);
app.use('/', register);
app.use('/', welcome);





// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));



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
