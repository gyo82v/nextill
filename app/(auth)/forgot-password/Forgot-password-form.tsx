"use client";

import {useState} from "react";
import { resetPassword } from "@/firebase/accountAuth";
import { FiMail } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { inputBaseStyle, formContainerStyle, cardBaseStyle } from "@/styles";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const {t} = useTranslation("auth")

  async function handleSubmit(e:React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      setError(t("forgotPssw.form.error"));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className={`${cardBaseStyle} mt-6 rounded-xl border border-border bg-muted/30 p-4`}>
        <div className="flex items-start gap-3 ">
          <FiMail className="h-5 w-5 text-primary " />
          <div className="space-y-1">
            <p className="font-medium">
                {t("forgotPssw.form.title")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("forgotPssw.form.description")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${formContainerStyle} mt-6 space-y-4`}>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t("forgotPssw.form.label")}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`${inputBaseStyle}`}
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-600" aria-live="polite">
          {error}
        </p>
      ) : null}
      
      <Button
        type="submit"
        loading={loading}
        loadingText={t("forgotPssw.form.loadingText")}
        disabled={loading}
      >
        {t("forgotPssw.form.buttonLabel")}
      </Button>
      <p className="text-xs text-muted-foreground">
        {t("forgotPssw.form.textBottom")}
      </p>
    </form>
  );
}