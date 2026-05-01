"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase/authProvider";
import { useTranslation } from "react-i18next";

import {
  formContainerStyle,
  formSectionStyle,
  formFieldStyle,
  formLabelStyle,
  formActionsStyle,
  inputBaseStyle,
  focusRing
} from "@/styles";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "../ui/Button";


export default function SignInForm() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/pos");
    }
  }, [loading, user, router]);

  async function handleSubmit(e:React.SyntheticEvent) {
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

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={`${formContainerStyle} rounded-3xl border border-default bg-surface-1
                    p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8`}
      >
        <div className={formSectionStyle}>
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              Nextill
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              {t("signIn.title")}
            </h1>
          </div>

          {error && (
            <div className={`rounded-2xl border border-red-200 bg-red-50
                             px-4 py-3 text-sm text-red-700`}>
              {error}
            </div>
          )}

          <div className={formFieldStyle}>
            <label htmlFor="email" className={formLabelStyle}>
              {t("signIn.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseStyle}
              autoComplete="email"
              placeholder={t("signIn.emailPlaceholder")}
            />
          </div>

          <PasswordInput
            id="password"
            label={t("signIn.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className={formActionsStyle}>
          <Button
            type="submit"
            loading={submitting}
            loadingText={t("signIn.submitting")}
            className="w-full"
          >
            {t("signIn.submit")}
          </Button>

          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted ">
            <p>
              {t("signIn.noAccount")}{" "}
              <Link 
                href="/sign-up" 
                className={`font-medium text-primary underline-offset-4 hover:underline ${focusRing}`}>
                {t("signIn.createOne")}
              </Link>
            </p>

            <Link 
              href="/forgot-password" 
              className={`font-medium text-primary underline-offset-4 hover:underline ${focusRing}`}
            >
              {t("signIn.forgotPassword")}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
