"use client";

import AccountSectionCard from "./AccountSectionCard";
import type {FeedbackState, ExportDataSectionProps} from "@/types";
import {useState} from "react"
import ExportRow from "./export/ExportRow";
import { useTranslation } from "react-i18next";

export default function ExportDataSection({
  onExportPdf,
  onExportBackup,
}: ExportDataSectionProps) {
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingBackup, setLoadingBackup] = useState(false)
  const {t} = useTranslation("account")

  async function handleExportPdf(){
    setFeedback(null)
    setLoadingPdf(true)

    try{
      await onExportPdf()
      setFeedback({
        type: "success",
        message: t("export.messages.pdfSuccess"),
      });
    }catch(err){
       setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : t("export.messages.pdfError"),
      });
    }finally{
      setLoadingPdf(false)
    }
  }

  async function handleBackup(){
    setFeedback(null)
    setLoadingBackup(true)

    try{
      await onExportBackup()
      setFeedback({
        type: "success",
        message: t("export.messages.backupSuccess"),
      });
    }catch(err){
       setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : t("export.messages.backupError"),
      });
    }finally{
      setLoadingBackup(false)
    }
  }

  return (
    <AccountSectionCard
      title={t("export.title")}
      description={t("export.description")}
    >
      <div className="space-y-4">
        {feedback ? (
          <div
            className={[
              "rounded-xl border px-4 py-3 text-sm",
              feedback.type === "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700",
            ].join(" ")}
          >
            {feedback.message}
          </div>
        ) : null}

        <ExportRow
          title={t("export.pdf.title")}
          description={t("export.pdf.description")}
          buttonLabel={t("export.pdf.buttonLabel")}
          onClick={handleExportPdf}
          loading={loadingPdf}
        />

        <ExportRow
          title={t("export.backup.title")}
          description={t("export.backup.description")}
          buttonLabel={t("export.backup.buttonLabel")}
          onClick={handleBackup}
          loading={loadingBackup}
        />
      </div>
    </AccountSectionCard>
  );
}
