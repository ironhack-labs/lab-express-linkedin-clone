const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/auth');

/* GET users listing. */
userRouter.get('/profile', auth('/login'), (req, res, next) => {
  const user = req.session.currentUser;
  res.render('user/profile', { user });
});

module.exports = userRouter;
