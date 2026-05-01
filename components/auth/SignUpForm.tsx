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
  focusRingInset,
  focusRing,
  inputBaseStyle
} from "@/styles";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "../ui/Button";

export default function SignUpForm() {
  const { createUser, user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("auth");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
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
      await createUser(email, password, name);
      router.replace("/pos");
    } catch (err: unknown) {
      setError((err as Error).message ?? "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={`${formContainerStyle} rounded-3xl border border-default
                    bg-surface-1 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)]
                    sm:p-8`}
      >
        <div className={formSectionStyle}>
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              Nextill
            </p>
            <h1 
              className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
            >
              {t("signUp.title")}
            </h1>
          </div>

          {error && (
            <div className={`rounded-2xl border border-red-200 bg-red-50
                             px-4 py-3 text-sm text-red-700`}>
              {error}
            </div>
          )}

          <div className={formFieldStyle}>
            <label htmlFor="name" className={formLabelStyle}>
              {t("signUp.name")}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputBaseStyle}
              autoComplete="name"
              placeholder={t("signUp.namePlaceholder")}
            />
          </div>

          <div className={formFieldStyle}>
            <label htmlFor="email" className={formLabelStyle}>
              {t("signUp.email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseStyle}
              autoComplete="email"
              placeholder={t("signUp.emailPlaceholder")}
            />
          </div>

          <PasswordInput
            id="password"
            label={t("signUp.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <div className="rounded-2xl border border-default bg-surface-2 px-4 py-3">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                required
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className={`mt-1 h-4 w-4 rounded border-default
                            accent-[var(--primary)] ${focusRingInset}`}
              />
              <span className="leading-6">
                {t("signUp.privacyConsent")}{" "}
                <Link
                  href="/privacy-policy"
                  className={`font-medium text-primary underline-offset-4 hover:underline
                              ${focusRing}`}
                >
                  {t("signUp.privacyPolicy")}
                </Link>
                .
              </span>
            </label>
          </div>
        </div>

        <div className={formActionsStyle}>
          <Button
            type="submit"
            loading={submitting}
            loadingText={t("signUp.submitting")}
            className="w-full"
          >
            {t("signUp.submit")}
          </Button>

          <p className="text-center text-sm text-muted">
            {t("signUp.alreadyHaveAccount")}{" "}
            <Link
              href="/sign-in"
              className={`font-medium text-primary underline-offset-4 hover:underline
                          ${focusRing}`}
            >
              {t("signUp.signIn")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
