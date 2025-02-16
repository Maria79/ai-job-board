"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "job-seeker",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.name || !user.email || !user.password) {
      setError("All fields are required");
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/auth/signin"), 2000);
    } else {
      setError(data.error);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <select
          className="border p-2 rounded"
          onChange={(e) => setUser({ ...user, role: e.target.value })}
        >
          <option value="job-seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-blue-500 font-bold">
          Sign In
        </Link>
      </p>
    </div>
  );
}
