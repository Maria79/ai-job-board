import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverLetter: String,
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Rejected"],
    default: "Pending",
  },
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
