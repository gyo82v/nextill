import Button from "@/components/ui/Button";
import type { ExportRowProps } from "@/types";
import { useTranslation } from "react-i18next";

export default function ExportRow({title, description, buttonLabel, onClick, loading}: ExportRowProps) {
  const {t} = useTranslation("account")
  return (
    <div className={`flex flex-col gap-4 rounded-xl border border-default bg-surface-2
                     px-4 py-3 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onClick}
        loading={loading}
        loadingText={t("export.buttonLabelDownload")}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}