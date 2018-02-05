const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const postSchema = new Schema({
content: {
type: String,
required: true,
maxlength: 280,
},
_creator: {
    type: Schema.Types.ObjectId,
    ref:'User',
}

});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;