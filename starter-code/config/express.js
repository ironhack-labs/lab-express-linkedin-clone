var express = require('express');
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)

module.exports = (app)=>{
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.set("layout","layout")

app.use(session({
  secret: 'basic-auth-secret',
  cookie: {maxAge : 60000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60
  })
}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
}
