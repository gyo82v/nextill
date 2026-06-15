import type { SettingRowProps } from "@/types";

export default function SettingRow({
  label,
  description,
  children,
}: SettingRowProps) {
  return (
    <div className={`flex flex-col gap-4 rounded-xl border border-default bg-surface-2
                     px-4 py-3 md:flex-row md:items-center md:justify-between`}>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground">{label}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="md:shrink-0">{children}</div>
    </div>
  );
}