"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthDescription from "@/components/auth/AuthDescription";
import SignUpForm from "@/components/auth/SignUpForm";
import { useTranslation } from "react-i18next";

export default function SignUpPage() {
  const { t } = useTranslation("auth");

  return (
    <AuthLayout
      description={
        <AuthDescription
          title={t("welcome")}
          description={t("description")}
          benefit={t("benefit")}
          freeNote={t("free")}
          cta={t("cta.signUp")}
          featuresTitle={t("features.title")}
          features={[
            t("features.till"),
            t("features.menu"),
            t("features.stock"),
            t("features.devices"),
          ]}
        />
      }
      form={<SignUpForm />}
    />
  );
}
