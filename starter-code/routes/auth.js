var express         = require('express');
const bcrypt        = require('bcrypt');
const passport      = require('passport');
const User          = require('../model/user');

var router          = express.Router();
const bcryptSalt    = 10;

router.get("/signup", (req, res, next) => {
    res.render("auth/signup", { "title": "Sign Up"});
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;

    if (username === "" || password === "") {
        return res.render("signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
    }

    User.findOne({ "username": username },
    "username",
    (err, user) => {
        if (user !== null) {
            res.render("signup", {
            errorMessage: "The username already exists"
            });
            return;
        }

        var salt = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);

        var newUser = User({
            username: username,
            name: name,
            email: email,
            password: hashPass,
            summary: undefined,
            imageUrl: undefined,
            company: undefined,
            jobTitle: undefined
        });

        newUser.save((err) => {
            if (err) {
            res.render("signup", {
                errorMessage: "Something went wrong"
            });
            } else {
                res.redirect("/login");
            }
        });
    });

    // res.render("auth/signup", { "title": "Sign Up"});
    // console.log("hola")
});

router.get('/login', (req, res, next) => {
  console.log('Login');
  
  res.render('auth/login', { "message": req.flash("error") });
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/profile",
  failureRedirect: "/"
}));

router.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

router.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/profile"
}));

module.exports = router;