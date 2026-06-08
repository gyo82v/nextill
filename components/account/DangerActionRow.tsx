import Button from "../ui/Button";
import type { DangerActionRowProps } from "@/types";


function DangerActionRow({title, description, buttonLabel, onClick, disabled,}: DangerActionRowProps) {
  return (
    <div className={`flex flex-col gap-4 rounded-xl border border-default bg-surface-2
                     px-4 py-3 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="space-y-1 flex-3">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button
        type="button"
        variant="primaryDanger"
        onClick={onClick}
        disabled={disabled || !onClick}
        className="flex-1"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default DangerActionRow