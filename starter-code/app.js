const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const index = require('./routes/index');
const users = require('./routes/users');
const authentication = require("./routes/auth");

const app = express();

// database setup
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/linkedin', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// authentication setup
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("layout", "layouts/main");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/authentication', authentication);

// error snippets
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

// app.use(session({
//   secret: "basic-auth-secret";
//   cookie: {}
// }))


module.exports = app;
