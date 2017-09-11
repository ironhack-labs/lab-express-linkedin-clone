const app = require('express')()
const mongoose = require('mongoose')
const globals = require('./config/db')
const path = require('path')


const index = require('./routes/index')
const authController = require('./routes/authController')
const profController = require("./routes/profController")

mongoose.connect(globals.dbURL).then(() => console.log('Connected to DB'))

app.locals.title = 'Express Linkedin Clone'

require('./config/express')(app)

app.use('/', index)
app.use('/', authController)
app.use("/profile", profController)

require('./config/handle-errors')(app)

module.exports = app
