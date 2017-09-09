const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const logger = require('morgan')
const path = require('path')
const mongoose = require('mongoose')
const {rootPath} = require('./config')
const expressLayouts = require("express-ejs-layouts")

module.exports = app => {
  app.set('views', rootPath + 'views')
  app.set('view engine', 'ejs')
  app.set('layout','layout')
  app.use(expressLayouts)
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(rootPath + 'public'))
  app.use(session({
    secret: "linkedin-auth",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  }))
  app.use((req,res,next) => {
    res.locals.title = 'Express Linkedin Auth'
    next()
  })
}