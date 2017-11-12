const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

const router = express.Router();
const bcryptSalt = 10;

router.get("/signup", (req, res) => {
  res.render("authentication/signup");
});

router.post("/signup", (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({"username": username}, "username", (err, user) => {
    if (user !== null) {
      res.render("authentication/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      name: name,
      username: username,
      email: email,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/users/login");
    });
  });
});

router.get("/login", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/home");
  } else {
    res.render("authentication/login");
  }
});

router.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("authentication/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/home");
      } else {
        res.render("authentication/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/users/login');
  });
});

router.get('/:userId/posts/new', (req, res, next) => {
  let userId = req.params.userId;
  let currentUser = req.session.currentUser;
  if (currentUser._id === userId) {
    res.render('posts/new', {userId});
  }
});

router.post('/:userId/posts', (req, res, next) => {
  let userId = req.params.userId;
  let content = req.body.content;
  let postInfo = {
    content: content,
    _creator: userId
  };

  const newPost = new Post(postInfo);

  newPost.save(err => {
    if (err) { return res.render('posts/new'); }
    return res.redirect('/home');
  });
});

router.get('/:postId/edit', (req, res, next) => {
  let postId = req.params.postId;
  let userId = req.session.currentUser._id;

  Post.findById(postId, (err, post) => {
    if (err) { return next(err); }
    res.render('posts/edit', {userId, post});
  });
});

router.post('/:userId/posts/:postId', (req, res, next) => {
  let postId = req.params.postId;

  let postInfo = {
    content: req.body.content,
  }

  Post.findByIdAndUpdate(postId, postInfo, (err, post) => {
    if (err) { return next(err); }
    return res.redirect('/home');
  });
});

module.exports = router;
