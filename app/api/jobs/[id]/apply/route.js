import { connectToDatabase } from "@/lib/db";
import Application from "@/models/Application";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/mail";

export async function POST(req, { params }) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const job = await Job.findById(params.id).populate("postedBy");

  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  // Create new application
  const newApplication = await Application.create({
    jobId: params.id,
    userId: session.user.id,
    coverLetter: body.coverLetter,
  });

  // Send email notification to employer
  await sendEmail({
    to: job.postedBy.email,
    subject: `New Application for ${job.title}`,
    text: `A new application has been submitted for ${job.title}.`,
    html: `<p>A new job seeker has applied for <strong>${job.title}</strong>.</p>
           <p>Review the application in your employer dashboard.</p>`,
  });

  return Response.json(newApplication);
}
