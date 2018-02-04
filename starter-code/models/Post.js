const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    creatorId: {
        type: String,
        required: true
    },
    creatorName: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;