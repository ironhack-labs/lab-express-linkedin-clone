var express = require('express');
var router = express.Router();

/* GET INDEX */
router.get("/", (req,res) => {
  let user = req.session.currentUser;
  if(user){
    console.log("LOGGED")
    res.render("index", {user});
    return;
  } else{
    console.log("NOT LOGGED")
    res.redirect("/login");
  }
});

module.exports = router;
