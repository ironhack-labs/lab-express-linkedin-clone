const User = require('../models/user.model');
const Post = require('../models/post.model');
const moment = require('moment');


module.exports.new = (req, res, next) => {
  console.log(req.session);

  if (req.params.userId != req.session.currentUser._id) {
    res.redirect("/");
  } else {
    res.render('posts/new', {
      email: req.session.currentUser.email
      // post: req.session.currentUser.post
    });
  }
};

module.exports.create = (req, res, next) => {
  // console.log("Email " + req.body.email);
  // console.log("Post " + req.body.post);
  // console.log("ID " + req.session.currentUser._id);
  if (!req.body.email || !req.body.post) {
    //si post esta vacio
    console.log("1");
    
    res.redirect('/users/' + req.session.currentUser._id + '/posts/new');
  } else {
    console.log("2");
    const post = new Post({
      content: req.body.post,
      _creator: req.session.currentUser._id
    });
    post.save()
    .then(() => {
      console.log("SAVE");
      res.redirect('/users/' + req.session.currentUser._id + '/posts/new');
    })
    .catch(error => {
      console.log("4");
        console.error(error);
        if (error instanceof mongoose.Error.ValidationError) {
          res.redirect('/users/' + req.session.currentUser._id + '/posts/new')
        }
      });
  }
};