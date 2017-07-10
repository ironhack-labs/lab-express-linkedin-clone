const express      = require('express');
const app          = express();
const mongoose     = require('mongoose');
const session      = require('express-session');
const MongoStore   = require("connect-mongo")(session);
const fs           = require('fs');
const path         = require('path');
const favicon      = require('serve-favicon');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 300000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

const index = require('./routes/index');
const auth = require('./routes/auth-routes');

mongoose.connect('mongodb://localhost:27017/linkedin');

// Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log/access.log'), {flags: 'a'})
app.use(morgan('dev', {stream: accessLogStream}));

// view engine setup
app.use(expressLayouts);
app.set('layout', 'layouts/_main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use('/', index);
app.use('/', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
