const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');

module.exports.new = (req,res,next) =>{
      res.redirect('/index');
  } 


module.exports.new = (req,res,next) =>{
    const session = req.session.currentUser._id;
    console.log(session);
      res.render('posts/new', {
        session: session
      });
  } 

  module.exports.create = (req,res,next) =>{
    const session = req.session.currentUser;
    console.log(req.params.userId);
    User.findOne({ userId: req.params.userId })
        .then(user => {
            if (user != null) {
                res.render('auth/signup', { user: user, error: { username: 'Username already exists'} })
            } else {
                user = new User(req.body);
                post = new Post({
                    content: req.body.content,
                    _creator: user
                })
                post.save()
                    .then(() => {
                        req.session.currentUser = user;
                        res.redirect('/');
                    }).catch(error => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('/index', { user: user, error: error.errors })
                        } else {
                            next(error);
                        }
                    });
            }  
        }).catch(error => next(error));
  }