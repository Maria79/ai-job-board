import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: Number,
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Remote", "Contract"],
  },
  description: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
