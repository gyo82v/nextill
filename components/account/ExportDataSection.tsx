"use client";

import AccountSectionCard from "./AccountSectionCard";
import type {FeedbackState, ExportDataSectionProps} from "@/types";
import {useState} from "react"
import ExportRow from "./export/ExportRow";

export default function ExportDataSection({
  onExportPdf,
  onExportBackup,
}: ExportDataSectionProps) {
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingBackup, setLoadingBackup] = useState(false)

  async function handleExportPdf(){
    setFeedback(null)
    setLoadingPdf(true)

    try{
      await onExportPdf()
      setFeedback({
        type: "success",
        message: "pdf exported successfully",
      });
    }catch(err){
       setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to export pdf.",
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
        message: "backup exported successfully",
      });
    }catch(err){
       setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to export backup.",
      });
    }finally{
      setLoadingBackup(false)
    }
  }

  return (
    <AccountSectionCard
      title="Export data"
      description="Download a copy of your account data for backup, records, or transfer."
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
          title="PDF summary"
          description="Download a readable summary of your account, settings, and activity. Suitable for printing or sharing."
          buttonLabel="Download PDF"
          onClick={handleExportPdf}
          loading={loadingPdf}
        />

        <ExportRow
          title="Full backup (JSON)"
          description="Download a complete backup of your data in JSON format. Intended for backup or future restore."
          buttonLabel="Download backup"
          onClick={handleBackup}
          loading={loadingBackup}
        />
      </div>
    </AccountSectionCard>
  );
}
