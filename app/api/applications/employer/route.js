import { connectToDatabase } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "employer") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find jobs posted by this employer
  const jobs = await Job.find({ postedBy: session.user.id }).select(
    "_id title"
  );
  const jobIds = jobs.map((job) => job._id);

  // Fetch applications for these jobs
  const applications = await Application.find({ jobId: { $in: jobIds } })
    .populate("userId", "name email")
    .populate("jobId", "title");

  // Format response
  const formattedApplications = applications.map((app) => ({
    _id: app._id,
    jobTitle: app.jobId.title,
    applicantName: app.userId.name,
    applicantEmail: app.userId.email,
    status: app.status,
  }));

  return Response.json(formattedApplications);
}
