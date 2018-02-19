var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const mongoose = require("mongoose");
//sessions
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const expressLayouts = require('express-ejs-layouts');

//conectar db
mongoose.connect("mongodb://localhost:27017/linkedin");

var home = require('./routes/home');
var profiles = require('./routes/profile');
var posts = require('./routes/post');

var app = express();

//configurar sessions
app.use(session({
  secret:"davinia",
  cookie:{maxAge:60000},
  store:new MongoStore({
    mongooseConnection:mongoose.connection,
    ttl:24*60*60
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 /* New */
 app.use(expressLayouts);
 app.set('layout', 'layouts/main-layout');


app.use('/', home);
app.use('/profile', profiles);
app.use('/post', posts);


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
