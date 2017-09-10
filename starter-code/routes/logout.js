const express = require('express');
const router = express.Router();
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);

router.get('/', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
