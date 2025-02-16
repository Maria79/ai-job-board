"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        AI Job Board
      </Link>

      <div className="flex gap-4">
        <Link href="/jobs">Jobs</Link>

        {session?.user ? (
          <>
            {session.user.role === "employer" && (
              <Link href="/employer-dashboard">Dashboard</Link>
            )}
            {session.user.role === "job-seeker" && (
              <Link href="/profile">Profile</Link>
            )}

            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/signin">
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-gray-200 text-black px-4 py-2 rounded">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
