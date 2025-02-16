import { connectToDatabase } from "@/lib/db";
import Application from "@/models/Application";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/mail";

export async function GET(req, { params }) {
  await connectToDatabase();
  const application = await Application.findById(params.id)
    .populate("userId", "name email")
    .populate("jobId", "title");

  if (!application) {
    return Response.json({ error: "Application not found" }, { status: 404 });
  }

  return Response.json({
    _id: application._id,
    jobTitle: application.jobId.title,
    applicantName: application.userId.name,
    applicantEmail: application.userId.email,
    coverLetter: application.coverLetter,
    status: application.status,
  });
}

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { status } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "employer") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const application = await Application.findById(params.id).populate("userId");

  if (!application) {
    return Response.json({ error: "Application not found" }, { status: 404 });
  }

  // Update application status
  application.status = status;
  await application.save();

  // Send email notification to job seeker
  await sendEmail({
    to: application.userId.email,
    subject: `Your Job Application Status: ${status}`,
    text: `Your application has been ${status}.`,
    html: `<p>Your application for <strong>${application.jobId.title}</strong> has been <strong>${status}</strong>.</p>
           <p>Check your profile for details.</p>`,
  });

  return Response.json({
    message: "Application status updated",
    status: application.status,
  });
}
