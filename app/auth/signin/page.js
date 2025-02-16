"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(callbackUrl); // Redirect to the main page or previous page
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Google Sign-In */}
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full bg-blue-500 text-white p-2 rounded mt-2"
      >
        Sign In with Google
      </button>

      {/* GitHub Sign-In */}
      <button
        onClick={() => signIn("github", { callbackUrl })}
        className="w-full bg-gray-800 text-white p-2 rounded mt-2"
      >
        Sign In with GitHub
      </button>

      {/* Divider */}
      <div className="text-center my-4 text-gray-500">or</div>

      {/* Email & Password Login */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-500 font-bold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
