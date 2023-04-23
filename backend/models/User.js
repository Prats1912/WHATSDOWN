import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  password: String,
  email: String,
  online: { type: Boolean, default: false },
  lastSeen: {
    type: Date,
  },
});

export default mongoose.model("user", UserSchema);