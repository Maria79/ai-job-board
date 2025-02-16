"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data); // Initialize filteredJobs with all jobs
      setLoading(false);
    }
    fetchJobs();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minSalary) {
      filtered = filtered.filter((job) => job.salary >= Number(minSalary));
    }

    if (maxSalary) {
      filtered = filtered.filter((job) => job.salary <= Number(maxSalary));
    }

    if (jobType) {
      filtered = filtered.filter((job) => job.jobType === jobType);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, location, minSalary, maxSalary, jobType, jobs]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Job Listings</h2>

      {/* Search & Filters */}
      <div className="flex flex-col gap-2 mb-4 p-4 border rounded bg-gray-100">
        <input
          type="text"
          placeholder="Search by job title or company"
          className="border p-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location"
          className="border p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Salary (€)"
            className="border p-2 rounded w-full"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Salary (€)"
            className="border p-2 rounded w-full"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
        </div>
        <select
          className="border p-2 rounded"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {/* Job Listings */}
      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs found based on your criteria.</p>
      ) : (
        <ul className="space-y-4">
          {filteredJobs.map((job) => (
            <li key={job._id} className="border p-4 rounded">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p>
                {job.company} - {job.location}
              </p>
              <p>Salary: €{job.salary}</p>
              <p>Type: {job.jobType}</p>
              <Link href={`/jobs/${job._id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                  View Details
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
