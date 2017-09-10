const express = require('express')
const mongoose = require('mongoose');
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);


module.exports = (app) => {

  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')
  app.use(expressLayouts)
  app.set("layout", "layouts/main-layout");

  app.use( session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  }));

  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../public')))

}
