const express            = require("express");
const timelineController = express.Router();

// Models
const Tweet = require("../models/tweet");

// Moment to format dates
const moment = require("moment");

timelineController.get("/", (req, res) => {
  Tweet
    // Timeline for this currentUser.
    // .find({ "user_name": req.session.currentUser.username }, "user_name tweet created_at")
    // Timeline for all users.
    .find({}, "user_name tweet created_at")
    .sort({ created_at: -1 })
    .exec((err, timeline) => {
      res.render("timeline/index", { timeline, moment });
  });
});

module.exports = timelineController;
