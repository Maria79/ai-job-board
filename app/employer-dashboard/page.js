"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function EmployerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until session loads
    if (status === "loading") return;

    // Check if session exists & role is employer
    if (!session || session?.user?.role !== "employer") {
      router.push("/"); // Redirect non-employers to homepage
    } else {
      fetchEmployerJobs();
    }
  }, [session, status, router]);

  async function fetchEmployerJobs() {
    setLoading(true);
    const res = await fetch("/api/jobs/employer");
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  // Show loading while checking session
  if (status === "loading" || !session) {
    return <p className="text-center mt-4">Checking authorization...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">
        Employer Dashboard
      </h2>
      <button
        onClick={() => router.push("/employer-dashboard/create-job")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Post a New Job
      </button>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job._id} className="border p-4 rounded">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p>
                {job.company} - {job.location}
              </p>
              <p>Salary: €{job.salary}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    router.push(`/employer-dashboard/edit-job/${job._id}`)
                  }
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/jobs/${job._id}`, { method: "DELETE" });
                    fetchEmployerJobs();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
