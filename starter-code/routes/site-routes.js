var express = require('express');
var siteRoutes = express.Router();

const User = require('../models/user')
  
siteRoutes.get("/", (req, res, next) => {
    if (req.session.currentUser) {
    let userInfo = { info: req.session.currentUser}
    res.render("home", userInfo);
    } else {
        res.redirect('/auth/login')
    }
    
});

siteRoutes.get('/profile/:userId', (req, res, next) => {
    if (req.session.currentUser) {
        let currentUserId = req.params.id
        User.findById(currentUserId, (err, user) => {
            if (err) {
                return next(err);
            }
            let userInfo = { info: req.session.currentUser}
            res.render('profile/showprivate', userInfo)
        })
     
    } else {
        let userInfo = { info: req.session.currentUser}
        res.render("profile/showPublic", userInfo);
      }
});

siteRoutes.get('/profile/:userId/edit', (req, res, next) => {
    if (req.session.currentUser) {
        let userInfo = { info: req.session.currentUser}
        res.render('profile/edit', userInfo)
    } else {
        res.redirect("/");
      }
})


siteRoutes.post('/profile/:userId', (req, res, next) => {
    const currentUserId = req.params.userId
    let updatedUser = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        summary: req.body.summary,
        imageUrl: req.body.imageUrl,
        company: req.body.company,
        jobTitle: req.body.jobTitle
    }
    User.findByIdAndUpdate(
      currentUserId,
      updatedUser,
      (err, user) => {
      if (err) {
        return next(err);
      }
      res.redirect('/profile/' + currentUserId)

    })

  })

module.exports = siteRoutes;
