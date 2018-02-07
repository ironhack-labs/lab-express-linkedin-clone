const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/", (req, res, next) => {
  res.render("profile", {
    title: "profile"
  });
});

/* CRUD -> READ DETAIL */
authRoutes.get("/:id", (req, res) => {
  const userId = req.params.id;
  let actualUser;
  if (req.session.currentUser != null) {
    actualUser = req.session.currentUser._id;
  }

  User.findById(userId, (err, u) => {
    if (err) {
      return next(err);
    }
    res.render("profile", {
      u: u,
      actualUser: actualUser
    });
  });
});

/* CRUD -> UPDATE USER FORM */
authRoutes.get("/:id/edit", (req, res) => {
  const userId = req.params.id;
  let actualUser = req.session.currentUser._id;
  if (actualUser === userId) {
    User.findById(userId, (err, u) => {
      if (err) {
        return next(err);
      }
      res.render("edit", {
        u: u
      });
    });
  } else {
    res.redirect(`/`);
  }
});

/* CRUD -> UPDATE USER in DATABASE */
authRoutes.post("/:id/", (req, res) => {
  const userId = req.params.id;
  const {
    username,
    password,
    confirmPassword,
    email,
    summary,
    imageUrl,
    company,
    jobTitle
  } = req.body;
  var updates;
  if (password != "" && confirmPassword != "") {
    if (password === confirmPassword) {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      updates = {
        username,
        password: hashPass,
        email,
        summary,
        imageUrl,
        company,
        jobTitle
      };
    } else {
      res.render("edit", {
        errorMessage: "The passwords do not match!"
      });
      return;
    }
  } else {
    updates = { username, email, summary, imageUrl, company, jobTitle };
  }

  User.findByIdAndUpdate(userId, updates, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.redirect(`/profile/${userId}`);
  });
});

/* CRUD -> DELETE USER FROM DATABASE */

authRoutes.get("/:id/delete", (req, res) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId, (err, usr) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
});

module.exports = authRoutes;
