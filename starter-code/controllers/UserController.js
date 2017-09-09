const User = require('../models/User')

module.exports = {
  profileGet: (req, res) => {
    const user = req.session.currentUser
    res.render('user/profile', {
      title: 'User page', 
      user: user
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
    
  }
}