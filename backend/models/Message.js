import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  message: [{
    content: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }]
});

//collection - define collection name and schema for storage.
export default mongoose.model("message", messageSchema);
