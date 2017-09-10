const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => res.send('respond with a resource'))

router.get('/', (req, res, next) => {
if (req.session.currentUser) {
  res.render('profile/private.ejs',{
    user: req.session.currentUser.name
  })
} else {
  res.redirect("login")}
})
module.exports = router;
