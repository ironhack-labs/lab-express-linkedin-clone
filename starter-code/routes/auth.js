const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const bcryptSalt = 10;

// SIGNUP: Print form
router.get('/signup', (req, res) => {
  if (req.session.currentUser) {
   console.log("usuario conectado, no puede acceder a sign Up, redirigido a home");
   res.redirect ('/');
 }
 else res.render('auth/signup', { title: 'Signup' });
});

// SIGNUP: Create user in db
router.post('/signup', function(req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username; //no sé para que lo pide en registro, si no se mete en bbdd, no está en modelo
  const password = req.body.password;
//validations
  if (name === "" || email === "" || username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Should indicate a name, a email, a username and a password to sign up"
    });
    return;
  }

  User.findOne({"name": name}).then(user => {
    if (user) {
      res.render("auth/signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        name: name,
        email: email,
        password: hashPass,
        summary: "",
        imageUrl: "",
        company: "",
        jobTitle: ""
      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });
});

// LOGIN: Print form
router.get('/login', (req, res) => {
  if (req.session.currentUser)  res.redirect ('/');
  else res.render('auth/login',{title: 'Login Here!'});
});

router.post("/login", (req, res, next) => {
const name = req.body.name;
const password = req.body.password;
  //validations
  if (name === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a name and a password to sign up"
    });
    return;
  }

  User.findOne({"name": name}, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The name doesn't exist"
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

// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
