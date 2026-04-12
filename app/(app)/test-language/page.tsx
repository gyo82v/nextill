"use client";

import { useTranslation } from "react-i18next";

export default function TestLanguagePage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">
        {t("test.title")}
      </h1>

      <p>{t("test.description")}</p>

      <p>
        <strong>Current language:</strong> {i18n.language}
      </p>
    </div>
  );
}