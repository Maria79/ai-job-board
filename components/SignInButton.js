"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Sign Out
    </button>
  ) : (
    <Link href="/auth/signin">
      <button className="px-4 py-2 bg-green-500 text-white rounded">
        Sign In
      </button>
    </Link>
  );
}
