const User = require('../models/User');
const Post = require('../models/Post');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const bcryptSalt = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.currentUser) {
    User.findOne({
        "username": req.session.currentUser.username
      }, "id",
      (err, user) => {
        if (err) { 
          return next(err);
        };
        Post.find({}, (err, allPosts) => {
          res.render('home', {
            name: req.session.currentUser.name,
            id: user.id,
            allPosts
          });
        });
      });
  } else {
    res.redirect('/login'); // COMPLETE
  }
});

router.get('/signup', function(req, res, next) {
  if (req.session.currentUser) {
    res.redirect('/');
  } else {
    res.render('authentication/signup');
  }
});

router.post('/signup', function(req, res, next) {
  // SAVE data username, password, name, email

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const name = req.body.name;

  if (username === "" || password === "" || email === "" || name === "") {
    res.render("auth/signup", {
      errorMessage: "Please, fill all fields"
    });
    return;
  }
  // if all is filled, search in bbdd
  User.findOne({
      "username": username
    },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }
      // if not exist, create and encrypt password
      var hashPass = bcryptPassConverter(password);

      var newUser = User({
        username,
        password: hashPass,
        email,
        name,
        jobTitle: "",
        company: "",
        imageUrl: "",
        summary: ""
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });
});

router.get('/login', function(req, res, next) {
  if (req.session.currentUser) {
    res.redirect('/');
  } else {
    res.render('authentication/login');
  }
});

router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render('auth/login', {
      errorMessage: "Please, fill user and pass to sign up"
    });
    return;
  }
  User.findOne({
    "username": username
  }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

router.get('/logout', function(req, res, next) {
  // End user session
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

router.get('/profile/:userId/edit', (req, res, next) => {
  User.findById(req.params.userId,
    (err, user) => {
      if (err) {
        res.redirect('/login');
      }
      if (typeof(req.session.currentUser) === 'undefined' ||
        req.session.currentUser.username != user.username) {
        // go back
        res.redirect('/login');
      } else {
        // go edit
        res.render('profiles/edit', user);
      } // end else
    });

});

router.get('/profile/:userId', (req, res, next) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) { 
      return next(err);
    };
    if ((typeof(req.session.currentUser)) !== 'undefined'
    && req.session.currentUser.username == user.username) {
      // if its same show private page
      user['public'] = 0;
      res.render('profiles/show', user);
    } else {
      res.render('profiles/show', {
        name: user.name,
        jobTitle: user.jobTitle,
        imageUrl: user.imageUrl,
        company: user.company,
        public: 1
      });

    };
  });
});
// name, password, newpassword, repeatpassword, jobTitle, image, company, email
router.post('/profile/:userId', (req, res, next) => {
  let myId = req.params.userId;
  let editUser = {
    name: req.body.name,
    jobTitle: req.body.jobTitle,
    imageUrl: req.body.imageUrl,
    company: req.body.company,
    email: req.body.email
  };
  console.log(editUser);
  User.findByIdAndUpdate(myId, editUser, (err, product) => {
    if (err) {
      return next(err);
    }
    res.redirect('/profile/' + myId);
  });
});

function bcryptPassConverter(password) {
  return hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt));
}

module.exports = router;
