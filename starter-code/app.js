var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const expressLayouts = require('express-ejs-layouts')

var app = express();

mongoose.connect("mongodb://localhost/ironLink")

const profileController = require('./routes/profilecontroller')
const authController = require('./routes/authController');
const siteController = require('./routes/siteController');
const postController = require('./routes/postController')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 60000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}))

app.use('/', authController);
app.use('/', siteController);
app.use('/profile', profileController);
app.use('/posts', postController)

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
