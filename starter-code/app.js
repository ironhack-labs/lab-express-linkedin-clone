const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const index = require('./routes/index');
const users = require('./routes/users');
const authRoutes = require('./routes/auth-routes');
const siteRoutes = require('./routes/site-routes');
const login = require('./routes/auth-routes');

const app = express();

// Controllers

// Mongoose configuration
mongoose.connect('mongodb://localhost/basic-auth');

// Middleware configurations
app.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Access POST params with body parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Authentication
app.use(cookieParser());

// Routes
app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/', authRoutes);
app.use('/', siteRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
