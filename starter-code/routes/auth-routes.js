const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 2;

module.exports = router;