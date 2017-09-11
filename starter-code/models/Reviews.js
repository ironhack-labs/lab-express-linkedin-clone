const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review:{
    type : String,
    required: [true, "Review can't be empty"]
  },
  user_id:{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  user_name : String,
},{
  timestamps:{createdAt: "created_at", updatedAt:"updated_at"}
})

module.exports = mongoose.model("Review", reviewSchema);
