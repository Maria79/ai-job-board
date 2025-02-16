"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [status]);

  async function fetchUserProfile() {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setUser(data);
    setBio(data.bio || "");
    setSkills(data.skills || "");
  }

  async function handleTextSubmit(e) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ bio, skills }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setMessage("Profile updated successfully!");
      fetchUserProfile();
    } else {
      setMessage("Failed to update profile.");
    }
  }

  async function handleResumeUpload(e) {
    e.preventDefault();
    setMessage("");

    if (!resume) {
      setMessage("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    const res = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Resume uploaded successfully!");
      fetchUserProfile();
    } else {
      setMessage("Failed to upload resume.");
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You must be signed in to view this page.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">My Profile</h2>
      {message && <p className="text-center text-green-500">{message}</p>}

      {/* Update Bio & Skills */}
      <form onSubmit={handleTextSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={user?.name || ""}
          readOnly
          className="border p-2 rounded bg-gray-200"
        />
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="border p-2 rounded bg-gray-200"
        />
        <textarea
          placeholder="Short Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
      </form>

      {/* Upload Resume (now stored on Cloudinary) */}
      <form onSubmit={handleResumeUpload} className="mt-4 flex flex-col gap-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Upload Resume
        </button>
      </form>

      {/* Display Uploaded Resume */}
      {user?.resume && (
        <div className="mt-4">
          <p>
            Current Resume:{" "}
            <a
              href={user.resume}
              target="_blank"
              className="text-blue-500 underline"
            >
              Download Resume
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
