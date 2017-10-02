const express    = require("express");
const siteRoutes = express.Router();

siteRoutes.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
});


// Currently doing that:

authRoute.get('/profile/:userId/edit', (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId, (err, user) => {
    res.render('auth/edit', { userId });
  });
});
