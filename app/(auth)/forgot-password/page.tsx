"use client"

import Link from "next/link";
import ForgotPasswordForm from "./Forgot-password-form";
import { useTranslation } from "react-i18next";
import { cardBaseStyle } from "@/styles";

export default function ForgotPasswordPage() {
  const {t} = useTranslation("auth")
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 w-full ">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center">
        <div className={`${cardBaseStyle} rounded-2xl border border-border bg-background p-6 shadow-sm`}>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("forgotPssw.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("forgotPssw.description")}
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="mt-6 text-sm text-muted-foreground">
            {t("forgotPssw.label")}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              {t("forgotPssw.link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}