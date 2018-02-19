const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: String,
    _creator:String
});

module.exports = mongoose.model("Post", postSchema);