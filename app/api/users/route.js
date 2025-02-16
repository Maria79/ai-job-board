import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  await connectToDatabase();
  const users = await User.find();
  return Response.json(users);
}

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();
  const newUser = await User.create(body);
  return Response.json(newUser);
}
