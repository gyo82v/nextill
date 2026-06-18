import type { StockActivityItemProps } from "@/types";
import Button from "../ui/Button";
import { FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { StockActivityBadge } from "./StockActivityBadge";

export default function StockActivityCard({ activity, onDelete }: StockActivityItemProps) {
  const { t } = useTranslation("stock");
  const actionText = t(`activitySection.actions.${activity.action}`);

  return (
    <article className="flex justify-between w-full">
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <StockActivityBadge action={activity.action} />
          <span className="font-medium">{activity.itemName}</span>
        </div>
        <div className="opacity-80">
          {
            activity.action === "archive" ?
            t("activitySection.actions.archive") :
            t("activitySection.activityLine", {
              action: actionText,
              quantity: Math.abs(activity.quantityDelta),
              before: activity.quantityBefore,
              after: activity.quantityAfter,
            })
          }
        </div>
      </div>

      <Button
        variant="danger"
        type="button"
        onClick={() => onDelete(activity.id)}
        title={t("activitySection.deleteActivityLabel")}
        aria-label={t("activitySection.deleteActivityLabel")}
      >
        <FiTrash2 className="h-4 w-4" />
        <span className="hidden lg:block">
          {t("activitySection.deleteActivity")}
        </span>
      </Button>
    </article>
  );
}


/*
{t("activitySection.activityLine", {
            action: actionText,
            quantity: Math.abs(activity.quantityDelta),
            before: activity.quantityBefore,
            after: activity.quantityAfter,
          })}



*/
