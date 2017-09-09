const User = require('../models/User')

module.exports = {
  profileGet: (req, res, next) => {
    res.render('user/profile', {
      title: 'User page', 
      username: 'pepito'
    })
  }
}