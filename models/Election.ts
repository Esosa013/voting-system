import mongoose from "mongoose";

const ElectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  options: [{ name: String, count: { type: Number, default: 0 } }],
});

export default mongoose.models.Election || mongoose.model("Election", ElectionSchema);
