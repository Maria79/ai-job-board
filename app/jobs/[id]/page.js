import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req, { params }) {
  await connectToDatabase();
  const job = await Job.findById(params.id);
  return Response.json(job);
}
