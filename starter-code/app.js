const app      = require('express')();
const mongoose = require('mongoose');
const globals = require('./config/globals');

mongoose.connect(globals.url,{useMongoClient: true})
        .then(()=>console.log("Connected to DB"));

app.locals.title = "Error"
require("./config/express")(app)
var index = require('./routes/index');
var siteRoutes = require('./routes/siteRoutes')
// view engine setu
app.use('/', index);
app.use('/', siteRoutes)
// catch 404 and forward to error handler
require('./errors/errors')(app);

module.exports = app;
