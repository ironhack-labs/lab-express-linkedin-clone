const User = require('../models/User')
const Post = require('../models/Post')

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
      name     : req.body.name,
      email    : req.body.email,
      imageUrl : req.body.image,
      company  : req.body.company,
      jobTitle : req.body.job,
      sumary   : req.body.sumary
    }

    User.findByIdAndUpdate(userId, updates, (err, user) => {
      if (err) { return next(err) }
      res.redirect('/user/profile/' + userId)
    })
  },

  postGet: (req, res) => {
    const userId = req.params.id
    res.render('post/new', { title: 'New Post', userId: userId })
  },

  postPost: (req, res, next) => {
    const userId = req.params.id
    const post   = req.body.post

    new Post({
      _creator : userId,
      content  : post
    })
    .save()
    .then(() => res.redirect('/'))
    .catch(e => next(e))
  },

  postEditGet: (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId, (err, post) => {
      res.render('post/edit', { title: 'Edit post', post: post })    
    })
  },

  postEditPost: (req, res, next) => {
    const postId  = req.params.postId
    const content = req.body.post 
    const updates = {
      content : content
    }
    Post.findByIdAndUpdate(postId, updates, (err, post) => {
      if (err) { return next(err) }
      res.redirect('/')
    })
  }
}