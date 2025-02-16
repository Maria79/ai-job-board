"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationDetails({ params }) {
  const { id } = params;
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchApplication() {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      setApplication(data);
      setLoading(false);
    }
    fetchApplication();
  }, [id]);

  async function updateStatus(newStatus) {
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
    setApplication({ ...application, status: newStatus });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {loading ? (
        <p>Loading application...</p>
      ) : !application ? (
        <p>Application not found.</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold">
            Application for {application.jobTitle}
          </h2>
          <p>
            <strong>Applicant:</strong> {application.applicantName} (
            {application.applicantEmail})
          </p>
          <p>
            <strong>Cover Letter:</strong>
          </p>
          <p className="border p-2 rounded">{application.coverLetter}</p>
          <p>
            <strong>Status:</strong> {application.status}
          </p>

          {application.status === "Pending" && (
            <div className="mt-4">
              <button
                onClick={() => updateStatus("Accepted")}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus("Rejected")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
