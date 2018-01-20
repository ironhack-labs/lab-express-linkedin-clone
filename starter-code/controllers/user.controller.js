const User = require('../models/user.model');
const Post = require('../models/post.model');
const moment = require('moment');


module.exports.new = (req, res, next) => {
  // console.log(req.session);

  if (req.params.userId != req.session.currentUser._id) {
    res.redirect("/");
  } else {
    Post.find({_creator:req.params.userId})
      .sort({
        createdAt: -1
      })
      .then((posts) => {
        res.render('posts/new', {
          session: req.session.currentUser,
          posts: posts
        });
      })
      .catch(error => next(error));
  }
};

module.exports.create = (req, res, next) => {
  if (!req.body.email || !req.body.post) {
    //si post esta vacio
    res.redirect('/users/' + req.session.currentUser._id + '/posts/new');
  } else {
    const post = new Post({
      content: req.body.post,
      _creator: req.session.currentUser._id
    });
    post.save()
      .then(() => {
        res.redirect('/users/' + req.session.currentUser._id + '/posts/new');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.redirect('/users/' + req.session.currentUser._id + '/posts/new');
        }
      });
  }
};
module.exports.modify = (req, res, next) => {
  // res.send(req.params.postId);
    Post.findById(req.params.postId)
      .then((post) => {
        res.render('posts/new', {
          session: req.session.currentUser,
          post: post
        });
      })
      .catch(error => next(error));
};