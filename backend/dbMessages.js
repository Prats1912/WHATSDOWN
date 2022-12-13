import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

//collection - define collection name and schema for storage.
export default mongoose.model("chats", messageSchema);
