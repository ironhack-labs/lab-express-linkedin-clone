/*jshint esversion:6*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/linkedin-lab');

const session = require("express-session");
const createMongoStorage = require("connect-mongo");
const MongoStore = createMongoStorage(session);

const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Controllers
// const index = require('./routes/index');
const authController = require("./routes/authController");
// const profileController = require("./routes/profileController");
// const tweetsController = require("./routes/tweetsController");
// const timelineController = require("./routes/timelineController");

const app = express();

app.use(expressLayouts);
app.set("layout", "layouts/main-layout");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "basic-auth-secret",
  cookie: {
    maxAge: 60000 * 5
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  resave: true,
  saveUninitialized: true
}));

// Routes
// app.use('/', index);
app.use("/", authController);
// app.use("/home", index);
// app.use("/profile", profileController);
// app.use("/timeline", timelineController);

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
