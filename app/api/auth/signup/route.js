import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectToDatabase();
  const { name, email, password, role } = await req.json();

  // Convert email to lowercase before saving
  const emailLower = email.toLowerCase();

  // Check if user already exists
  const existingUser = await User.findOne({ email: emailLower });
  if (existingUser) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user
  const newUser = await User.create({
    name,
    email: emailLower,
    password: hashedPassword,
    role,
  });

  return Response.json(
    { message: "User created successfully!" },
    { status: 201 }
  );
}
