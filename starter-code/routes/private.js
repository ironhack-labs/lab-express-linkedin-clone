const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

// GET home page.
// If you're logged in, you get into the homepage, if you don't, you're redirected to the log in page.
router.get('/home', isLoggedIn, (req, res) => {
  res.render('home', {user});
});

// POST edit page
// Send to the ddbb the changes
router.post('/profile/:id', (req, res, next) => {
  const userId = req.params.id;
  /*
   * Create a new object with all of the information from the request body.
   * This correlates directly with the schema of Product
   */
  const updates = {
     username : req.body.username,
     email : req.body.email,
     password : req.body.password,
     summary : req.body.summary,
     imageURL : req.body.imageURL,
     company : req.body.company,
     jobtittle : req.body.jobtittle
  };

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err){ return next(err); }
    res.render('home',{user: user});
  });
});

// GET show page
// Show the profile of the user
router.get('/profile/show/:id', (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    Post.find({"_owner" : userId}, (err, posts) => {
      if (err) { return next(err); }
      res.render('profile/show', {
        user: user,
        session: req.session.currentUser,
        posts: posts
      });
    });
  });


});

// GET edit page
// Throws you to the edit profile page
router.get('/profile/:id/edit', (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('profile/edit', { user: user });
  });
});


// GET new post page
// Lets the user introduce a new post
router.get('/users/:id/posts/new', (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) { return next(err); }
    res.render('posts/new', { user: user });
  });
});

// POST new post form
// Save the new post in the ddbb
router.post('/users/:id/posts', isLoggedIn, (req, res, next) => {
  const userId = req.params.id;

  let newPost = new Post({
    content: req.body.content,
    _owner: userId});

  newPost.save((err) => {
    if (err) {
      res.render("posts/new",
        {
          user : user,
          errorMessage: "Couldn't save the data!",
        });
    }
    else {
      res.redirect("/profile/show/" + userId);
    }
  });
});

module.exports = router;
