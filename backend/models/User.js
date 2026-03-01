import mongoose from "mongoose";

// one to many relationship between user and task
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // indexed(unique automatically creates index)
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("User", userSchema);