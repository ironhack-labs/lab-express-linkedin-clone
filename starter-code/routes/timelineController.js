const express            = require("express");
const timelineController = express.Router();

// Models
const Post = require("../models/post");

// Moment to format dates
const moment = require("moment");

timelineController.get("/", (req, res) => {
  Post
    .find({}, "user_name post created_at")
    .sort({ created_at: -1 })
    .exec((err, timeline) => {
      res.render("timeline/index", { timeline, moment });
  });
});

module.exports = timelineController;
