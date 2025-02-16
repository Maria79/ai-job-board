import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";
import path from "path";

export async function GET(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  return Response.json(user);
}

export async function POST(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";

    // If content-type is JSON, update bio and skills
    if (contentType.includes("application/json")) {
      const { bio, skills } = await req.json();
      const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { bio, skills },
        { new: true }
      );
      return Response.json(updatedUser);
    }

    // Otherwise, assume it's a form-data request for file upload
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check if the file is a PDF
    if (!file.name.endsWith(".pdf")) {
      return Response.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Use "raw" for non-image files
          folder: "resumes", // Uploads will be stored in the 'resumes' folder
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    // Update the user's resume field in MongoDB with the Cloudinary URL
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { resume: uploadResult.secure_url },
      { new: true }
    );

    return Response.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
