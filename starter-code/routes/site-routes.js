'use strict';

const express = require('express');
const siteRoutes = express.Router();

siteRoutes.get('/', (req, res, next) => {
  res.render('./auth/login');
});

module.exports = siteRoutes;
