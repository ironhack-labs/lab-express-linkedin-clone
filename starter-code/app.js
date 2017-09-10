const mongoose = require('mongoose');
const globals = require('./config/globals');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const layouts = require('express-ejs-layouts');
const session = require("express-session");
const path = require('path');
const MongoStore = require("connect-mongo")(session);
const app = express();

mongoose.connect(globals.dbUrl)
  .then( () => console.log("Connected to db!"));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.set('layout','layout');

app.use(session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  }));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

// const index = require('./routes');
// app.use('/', index);

const user = require('./routes/users');
app.use('/', user);

require('./config/error-handler')(app);

module.exports = app;
