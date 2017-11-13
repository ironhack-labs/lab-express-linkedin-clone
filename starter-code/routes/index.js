const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  const data = {
    title: "Linked In"
  };
  res.render("index", data);
});

module.exports = router;
