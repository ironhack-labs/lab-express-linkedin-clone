var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/auth/login');
  }

  const data = {
    title: 'LinkedIn',
    username: req.session.currentUser.name /* ====> need to access username on database */
  };
  res.render('index', data);
});

module.exports = router;
