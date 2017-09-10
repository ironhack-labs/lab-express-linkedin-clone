const User = require('../models/User')

module.exports = {
  profileGet: (req, res, next) => {
    const userSession = req.session.currentUser
    const userId = req.params.id
    User.findById(userId, (err, user) => {
      if (err) { return next(err) }
      res.render('user/profile', { 
        title:'User page', 
        user:user,
        userSession: userSession
      })
    })
  },

  editGet: (req, res, next) => {
    const userId = req.params.id
    User.findById(userId, (err, user) => {
      if (err) { return next(err) }
      res.render('user/edit', { title:'Edit profile', user:user })
    })
  },

  editPost: (req, res, next) => {
    const userId = req.params.id
    const updates = {
      name    : req.body.name,
      email   : req.body.email,
      imageUrl: req.body.image,
      company : req.body.company,
      jobTitle: req.body.job,
      sumary  : req.body.sumary
    }

    User.findByIdAndUpdate(userId, updates, (err, user) => {
      if (err) { return next(err) }
      res.redirect('/user/profile/' + userId)
    })
  }
}