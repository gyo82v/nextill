import Button from "@/components/ui/Button";

export default function ExportRow({
  title,
  description,
  buttonLabel,
  onClick,
  loading,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default bg-surface-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={onClick}
        loading={loading}
        loadingText="Downloading"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}