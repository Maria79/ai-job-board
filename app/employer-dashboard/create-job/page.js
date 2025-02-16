"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJob() {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify(job),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSuccess("Job posted successfully!");
      setTimeout(() => router.push("/employer-dashboard"), 2000);
    } else {
      setError("Failed to post job.");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Post a New Job</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Job Title"
          required
          onChange={(e) => setJob({ ...job, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company Name"
          required
          onChange={(e) => setJob({ ...job, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          required
          onChange={(e) => setJob({ ...job, location: e.target.value })}
        />
        <input
          type="number"
          placeholder="Salary"
          required
          onChange={(e) => setJob({ ...job, salary: e.target.value })}
        />
        <select onChange={(e) => setJob({ ...job, jobType: e.target.value })}>
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Remote</option>
          <option>Contract</option>
        </select>
        <textarea
          placeholder="Job Description"
          required
          onChange={(e) => setJob({ ...job, description: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Post Job
        </button>
      </form>
    </div>
  );
}
