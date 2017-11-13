const express           = require("express");
const profileController = express.Router();
const User  = require("../models/user");
const moment = require("moment");

profileController.get("/:id", (req, res, next) => {
  User.findOne({ _id: req.params.id }, "").exec((err, user) => {
    if (!user) { return next(err); }
    console.log( user, req.session.currentUser)
    res.render("profiles/show", {
        user: user,
        session: req.session.currentUser,
    });
  });
});

profileController.post("/:id", (req, res, next) => {
    var id = req.params.id;
    const updates = {
      name: req.body.name,
      email: req.body.email,
      imageUrl: req.body.imageUrl,
      jobTitle: req.body.jobTitle,
      company: req.body.company,
      summary: req.body.summary,
    };

    User.findByIdAndUpdate(id, updates, (err, profile) => {
     if (err){ return next(err) }
     res.redirect("/profile/" + id );
   });
});

profileController.get("/:id/edit", (req, res, next) => {
    const session = req.session.currentUser;
    res.render("profiles/edit", {
          session: session,
      });
  });



module.exports = profileController;
