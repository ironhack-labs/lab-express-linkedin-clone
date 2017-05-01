/*jshint esversion: 6*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const friendshipSchema = new Schema({
  friendship: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
