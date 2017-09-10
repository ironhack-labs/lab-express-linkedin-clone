const express        = require('express')
const path           = require('path')
const favicon        = require('serve-favicon')
const logger         = require('morgan')
const cookieParser   = require('cookie-parser')
const bodyParser     = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const mongoose       = require('mongoose')
const {dbURL}        = require('./db')

module.exports = app => {
  mongoose.connect(dbURL, {useMongoClient: true})
        .then(() => console.log('Conectado a la BBDD'))

  // view engine setup
  app.set('views', path.join(__dirname, '../views'))
  app.set('view engine', 'ejs')
  app.set('layout','main-layout');
  app.use(expressLayouts);

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../public')))
}
