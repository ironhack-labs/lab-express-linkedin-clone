const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content:String,
    _creator:Schema.Types.ObjectId,
});

module.exports = mongoose.model("Post", postSchema);