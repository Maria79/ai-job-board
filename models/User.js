import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Will be hashed
  role: {
    type: String,
    enum: ["job-seeker", "employer"],
    default: "job-seeker",
  },
  bio: String, // Short user bio
  skills: String, // Comma-separated skills
  resume: String, // Path to uploaded resume
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
