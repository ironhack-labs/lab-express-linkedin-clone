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
    console.log(req.session.currentUser);
    User.findOne({ _id: req.params.userId })
        .then(user => {
            console.log(user);
            if (user == null) {
                res.render('auth/signup', { user: user, error: { username: 'Username already exists'} })
            } else {
                console.log(user);
                post = new Post({
                    content: req.body.content,
                    _creator: user,
                    username: session.username
                });
                console.log(post);
                post.save()
                    .then(() => {
                        req.session.currentUser = user;
                        res.redirect('/');
                    }).catch(error => {
                        console.log(error);
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.render('./', { user: user, error: error.errors })
                        } else {
                            next(error);
                        }
                    });
            }  
        }).catch(error => next(error));
  }