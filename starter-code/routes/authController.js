//will define the routes we need to create the basic authorization

const express = require("express");
const authController = express.Router();

authController.get("/signup", (req, res, next) => {
  res.render("authentication/signup");
});

module.exports = authController;
