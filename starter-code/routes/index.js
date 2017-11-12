const express = require('express');
const router = express.Router();

router.get('/home', (req, res, next) => {
  res.render('index');
});

module.exports = router;
