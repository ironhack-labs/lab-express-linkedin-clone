'use strict'

const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');

// npm install --save express-session connect-mongo
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

const authRoutes = require('./routes/auth-routes');
// Removed because of instructions
// const index = require('./routes/index');
// const users = require('./routes/users');

// Mongoose configuration
mongoose.connect("mongodb://localhost/linkedin");

// -- view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// -- middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// -- session
// Removed because of instructions
// app.use('/', index);
// app.use('/users', users);
app.use('/auth', authRoutes);



// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
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
