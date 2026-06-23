import type { StockActivityItemProps } from "@/types";
import Button from "../ui/Button";
import { FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { StockActivityBadge } from "./StockActivityBadge";
import { formatTime } from "@/lib/utils";

export default function StockActivityCard({ activity, onDelete }: StockActivityItemProps) {
  const { t } = useTranslation("stock");
  const actionText = t(`activitySection.actions.${activity.action}`);

  return (
  <article className="flex items-start justify-between gap-4 w-full">
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-2 min-w-0">
        <StockActivityBadge action={activity.action} />
        <span className="font-medium truncate">{activity.itemName}</span>
      </div>

      <p className="text-sm opacity-80">
        {activity.action === "archive"
          ? t("activitySection.actions.archive")
          : t("activitySection.activityLine", {
              action: actionText,
              quantity: Math.abs(activity.quantityDelta),
              before: activity.quantityBefore,
              after: activity.quantityAfter,
            })}
      </p>

      <p className="text-xs opacity-60">
        {formatTime(activity.createdAt)}
      </p>
    </div>

    <Button
      variant="danger"
      type="button"
      onClick={() => onDelete(activity.id)}
      title={t("activitySection.deleteActivityLabel")}
      aria-label={t("activitySection.deleteActivityLabel")}
      className="shrink-0 h-fit"
    >
      <FiTrash2 className="h-4 w-4" />
      <span className="hidden lg:block">
        {t("activitySection.deleteActivity")}
      </span>
    </Button>
  </article>
  );
}

