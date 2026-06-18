import { IconType } from "react-icons";
import { FiArrowUp, FiArrowDown, FiArchive } from "react-icons/fi";

export type StockActivityAction = "add" | "remove" | "archive";

const activityConfig: Record<
  StockActivityAction,
  {
    icon: IconType;
    bg: string;
    text: string;
    ring: string;
    label: string;
  }
> = {
  add: {
    icon: FiArrowUp,
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
    label: "Add activity",
  },
  remove: {
    icon: FiArrowDown,
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    label: "Remove activity",
  },
  archive: {
    icon: FiArchive,
    bg: "bg-zinc-50",
    text: "text-zinc-700",
    ring: "ring-zinc-200",
    label: "Archive activity",
  },
};

type StockActivityBadgeProps = {
  action: string;
  className?: string;
  size?: number;
};

export function StockActivityBadge({
  action,
  className = "",
  size = 16,
}: StockActivityBadgeProps) {
  const config = activityConfig[action as StockActivityAction] ?? activityConfig.archive;
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full p-1.5 ring-1 ring-inset",
        config.bg,
        config.text,
        config.ring,
        className,
      ].join(" ")}
      aria-label={config.label}
      title={config.label}
    >
      <Icon size={size} aria-hidden="true" />
    </span>
  );
}