import { connectToDatabase } from "@/lib/db";
import Job from "@/models/Job";

export async function GET(req) {
  await connectToDatabase();

  const { search, location, minSalary, maxSalary, jobType } =
    req.nextUrl.searchParams;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (minSalary) {
    query.salary = { ...query.salary, $gte: Number(minSalary) };
  }

  if (maxSalary) {
    query.salary = { ...query.salary, $lte: Number(maxSalary) };
  }

  if (jobType) {
    query.jobType = jobType;
  }

  try {
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return Response.json(jobs);
  } catch (error) {
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const newJob = await Job.create(body);
    return Response.json(newJob, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create job" }, { status: 500 });
  }
}
