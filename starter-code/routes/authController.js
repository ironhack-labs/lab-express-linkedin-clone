const express        = require("express");
const authController = express.Router();

// User model
const User           = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// ¿hace falta requerir express-session y connect-mongo aquí????


//Routes ---------------------

authController.get("/signup", (req, res, next) => {
  res.render("auth/signup"); // borrar comentario cuando la ruta este comprobada
});

authController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const summary = req.body.summary;
  const company = req.body.company;
  const jobTittle = req.body.jobTittle;
  const imageUrl = req.body.imageUrl;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass,
      email: email,
      summary: summary,
      company: company,
      jobTittle: jobTittle,
      imageUrl: imageUrl,
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        // User has been created...now what?
        res.redirect("/login");
      }
    });
  });
});



//login authentication-----------------

authController.get("/login", (req, res, next) => {
  res.render("auth/login");
});

authController.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate an email and a password to log in"
    });
    return;
  }

  User.findOne({ "email": email },
    "_id email password following",
    (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The email doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect("/"); //aquí se indica donde queremos que esté la home cuando el usuario esté logueado
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
      }
  });
});


//redirect to login from root ----------

authController.get("/", (req, res) => {
  res.redirect("/login");
});


//logout route -------------------

authController.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});


module.exports = authController;
