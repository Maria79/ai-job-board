import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "employer") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await Job.find({ postedBy: session.user.id });
  return Response.json(jobs);
}
