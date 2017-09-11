const express = require('express');
const router = express.Router();




router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/logIn");
  }
});

router.get('/welcome', function(req, res, next){
  res.render('welcome');
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
