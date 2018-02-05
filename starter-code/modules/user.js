const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userObject = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    // summary: String,
    // imageUrl: String,
})

const User = mongoose.model("User", userObject);

module.exports = User;