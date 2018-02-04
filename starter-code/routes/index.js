const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session.currentUser) {
    const userInfo = { info: req.session.currentUser };
    res.render('index', userInfo);
  } else {
    res.render('auth/login');
  }
});

module.exports = router;
