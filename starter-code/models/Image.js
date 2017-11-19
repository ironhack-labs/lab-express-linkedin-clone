const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const imageSchema = new Schema({
  image_path: String,
  image_name: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

var Image = mongoose.model("Image", imageSchema);
module.exports = Image;
