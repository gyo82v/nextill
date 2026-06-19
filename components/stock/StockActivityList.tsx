"use client";

import type { StockActivityListProps } from "@/types";
import Button from "../ui/Button";
import StockActivityCard from "./StockActivityCard";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {useState} from "react"

export default function StockActivityList({
  activity,
  onDelete,
  onClearAll,
  loadingClearActivity,
}: StockActivityListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {t} = useTranslation("stock")

  return (
    <section className="space-y-10 xl:space-y-14">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 ">
        <div>
          <h3 className="text-lg font-medium">
            {t("activitySection.title")}
          </h3>
          <p>{t("activitySection.description")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="danger"
            type="button"
            onClick={onClearAll}
            disabled={activity.length === 0}
            loading={loadingClearActivity}
          >
            {t("activitySection.clearActivityLogs")}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsOpen(i => !i)}
            className="flex items-center gap-2"
          >
            {isOpen ? (
              <>
                <FiEyeOff className="text-base" />
                <span> {t("activitySection.hide")}</span>
              </>
            ) : (
              <>
                <FiEye className="text-base" />
                <span> {t("activitySection.show")}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {isOpen ? (
  activity.length > 0 ? (
    <ul className="space-y-2 lg:space-y-3 xl:space-y-4">
      {activity.map((a) => (
        <li
          key={a.id}
          className="rounded-2xl border border-default bg-surface-1 p-4 shadow-sm"
        >
          <StockActivityCard activity={a} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">
      {t("activitySection.emptyActivityLog")}
    </p>
  )
) : (
  <p className="text-sm text-muted-foreground">
    {t("activitySection.hiddenActivityLog")}
  </p>
)}
    </section>
  );
}


