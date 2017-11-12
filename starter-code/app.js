var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const mongoose = require('mongoose');
const debug = require('debug')('basic-auth:'+ path.basename(__filename));
const expressLayouts = require('express-ejs-layouts');
const auth = require('./routes/auth');
const profile = require('./routes/profile');
// const postController = require('./routes/post');

//Lógica para saber si estamos logados
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
//const secretoRoutes = require('./routes/secreto');


// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Para usar los layouts
app.use(expressLayouts);
app.set('layout', __dirname + '/views/layout/main-layout');

const dbName = "mongodb://localhost/data-linkedin";
mongoose.connect(dbName, {useMongoClient:true})
        .then(() => debug(`Connected to db: ${dbName}`));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60*60*24*2 }, // 2 days
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use((req,res,next) =>{
  res.locals.user = req.session.currentUser;
  next();
})


app.use(express.static(path.join(__dirname, 'public')));
// ..other code
// Routes


// app.use('/', index);

app.use("/", auth);
app.use("/profile/", profile);

// app.use("/post", postController);

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
