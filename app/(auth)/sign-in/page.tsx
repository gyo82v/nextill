"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthDescription from "@/components/auth/AuthDescription";
import SignInForm from "@/components/auth/SignInForm";
import { useTranslation } from "react-i18next";

export default function SignInPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      description={
        <AuthDescription
          title={t("welcome")}
          description={t("description")}
          benefit={t("benefit")}
          freeNote={t("free")}
          cta={t("cta.signIn")}
          featuresTitle={t("features.title")}
          features={[
            t("features.till"),
            t("features.menu"),
            t("features.stock"),
            t("features.devices"),
          ]}
        />
      }
      form={<SignInForm />}
    />
  );
}
