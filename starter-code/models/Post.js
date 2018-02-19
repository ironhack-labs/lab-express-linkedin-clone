const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    body: {
        type: String,
        required: [true, "El post no puede estar vacio"]
      },
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
    user_name: String,
    }, 
  {
    timestamps: { 
        createdAt: "created_at", 
        updatedAt: "updated_at" 
    }
  
});

module.exports = mongoose.model("Post", postSchema);