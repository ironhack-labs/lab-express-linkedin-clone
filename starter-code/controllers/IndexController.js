const User = require('../models/User')
const Post = require('../models/Post')

module.exports = {
  index: (req, res, next) => {
    const userSession = req.session.currentUser
    Post.find({}, (err, posts) => {
      if (err) { return next(err) }
      User.find({}, (err, users) => {
        if (err) { return next(err) }
        res.render('index', { 
          title: 'Express linkedin Auth',
          posts: posts,
          users: users,
          userSession: userSession
        })
      })
    })
  }
}
