import type { StatCardProps } from "@/types";

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>

      <div className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}