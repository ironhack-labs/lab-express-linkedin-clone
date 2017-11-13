const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendshipSchema = new Schema([{
    idA: Schema.Types.ObjectId,
  },
  {
    idB: Schema.Types.ObjectId,
  },
]);

const Friendship = mongoose.model("Friendship", friendshipSchema);

module.exports = Friendship;
