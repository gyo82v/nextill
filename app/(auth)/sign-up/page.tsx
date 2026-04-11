"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/authProvider";
import Link from "next/link";

export default function SignUpPage() {
  const { createUser, user, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to app
  useEffect(() => {
    if (!loading && user) {
      router.replace("/till");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createUser(email, password, name);
      router.replace("/till");
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 p-6 border rounded-lg"
      >
        <h1 className="text-xl font-semibold text-center">
          Create your Nextill account
        </h1>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
        <p className="text-sm text-center">
  Already have an account?{" "}
  <Link
    href="/sign-in"
    className="underline font-medium"
  >
    Sign in
  </Link>
</p>
      </form>
    </div>
  );
}