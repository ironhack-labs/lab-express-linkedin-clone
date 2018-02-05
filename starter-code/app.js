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
const auth = require('./routes/auth');

const app = express();

// -- database

mongoose.connect('mongodb://localhost/linkedin-users', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session

app.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(function (req, res, next) { /* ===========> esto hace que podamos llamar user fields en un layout */
  app.locals.user = req.session.currentUser;
  next();
});

// Routes

app.use('/', index);
app.use('/users', users);
app.use('/auth', auth);

// -- 404 and error handler

// -- error handlers

app.use(function (req, res, next) {
  res.status(404);
  const data = {
    title: '404 Not Found'
  };
  res.render('not-found', data);
});

app.use(function (err, req, res, next) {
  console.error('ERROR', req.method, req.path, err);
  if (!res.headersSent) {
    const data = {
      title: '500 Ouch'
    };
    res.status(500);
    res.render('error', data);
  }
});

module.exports = app;
