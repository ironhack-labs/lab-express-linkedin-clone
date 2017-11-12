const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

const index = require('./routes/index');
//const users = require('./routes/users');
const authController = require("./routes/authController");
const postController = require("./routes/postController");
const timelineController = require("./routes/timelineController");
const profileController = require("./routes/profileController");

const app = express();

mongoose.connect('mongodb://localhost/linkedin');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set("layout", "layouts/main-layout");
// Session MIDDLEWARE.
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60*60*24*2 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use("/", authController);
app.use("/post", postController);
app.use('/timeline', timelineController);
app.use("/profile", profileController);
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
