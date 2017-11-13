const express = require("express");
const router = express.Router();
const User = require("../models/user").User;

router.get("/homepage", (req, res, next) => {
  // let id = req.params.id;
  const data = {
    user: req.session.currentUser
  };
  res.render("profile/homepage", data);
});

// router.post("/update", (req,res,next) => {
//   User.findOneAndUpdate({username: username} => {

//   })
// }

module.exports = router;
