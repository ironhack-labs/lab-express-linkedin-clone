'use strict';

const express = require('express');
const router = express.Router();

// --- GET home --- //
router.get('/', function(req, res) {
    res.render('home.ejs');
});

module.exports = router;
