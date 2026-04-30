"use client";

import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/authProvider";

import {
  formContainerStyle,
  formSectionStyle,
  formFieldStyle,
  formLabelStyle,
  formErrorTextStyle,
  formActionsStyle,
} from "@/styles/forms";
import { inputBaseStyle } from "@/styles";
import { buttonPrimaryStyle } from "@/styles/buttons";
import PasswordInput from "@/components/ui/PasswordInput";

export default function SignInForm() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/pos");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/pos");
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={`${formContainerStyle} rounded-3xl border border-default bg-surface-1 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8`}
      >
        <div className={formSectionStyle}>
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              Nextill
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Sign in to Nextill
            </h1>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className={formFieldStyle}>
            <label htmlFor="email" className={formLabelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseStyle}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className={formActionsStyle}>
          <button type="submit" disabled={submitting} className={buttonPrimaryStyle}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-medium text-primary underline-offset-4 hover:underline">
                Create one
              </Link>
            </p>

            <Link href="/forgot-password" className="font-medium text-primary underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}


/*

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/authProvider";


export default function SignInForm() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/pos");
    }
  }, [loading, user, router]);

  async function handleSubmit( e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/pos");
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className=" flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 p-6 border rounded-lg"
      >
        <h1 className="text-xl font-semibold text-center">
          Sign in to Nextill
        </h1>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

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
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-sm text-center">
  Don&apos;t have an account?{" "}
  <Link
    href="/sign-up"
    className="underline font-medium"
  >
    Create one
  </Link>
</p>
      </form>
    </div>
  );
}






*/