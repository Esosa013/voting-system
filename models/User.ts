import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  votedElections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Election" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
