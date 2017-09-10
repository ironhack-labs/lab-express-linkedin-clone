const express      = require('express');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const path         = require('path');
const favicon      = require('serve-favicon');

module.exports = (app) => {
  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(layouts);
};
