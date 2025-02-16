"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function JobApplications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; // Wait until session loads

    if (!session || session.user.role !== "employer") {
      router.push("/"); // Redirect non-employers
    } else {
      fetchApplications();
    }
  }, [session, status, router]);

  async function fetchApplications() {
    setLoading(true);
    const res = await fetch("/api/applications/employer");
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Job Applications</h2>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app._id} className="border p-4 rounded">
              <h3 className="text-lg font-bold">{app.jobTitle}</h3>
              <p>
                Applicant: {app.applicantName} ({app.applicantEmail})
              </p>
              <p>Status: {app.status}</p>
              <button
                onClick={() =>
                  router.push(`/employer-dashboard/applications/${app._id}`)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                View Application
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
