import Button from "../ui/Button";
import type { StockThresholdEditProps } from "@/types";
import { inputBaseStyle } from "@/styles";
import { useTranslation } from "react-i18next";

export default function ThresholdEdit({
  minQty,
  setMinQty,
  handleSave,
  handleCancel,
  savingThreshold,
  className,
}: StockThresholdEditProps) {

  const {t} = useTranslation("stock")
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="number"
        min={0}
        value={minQty}
        onChange={setMinQty}
        className={`${inputBaseStyle}`}
      />

      <Button
        type="button"
        onClick={handleSave}
        disabled={savingThreshold}
        loading={savingThreshold}
        variant="confirm"
      >
        {t("stockSection.item.save")}
      </Button>

      <Button type="button" variant="secondary" onClick={handleCancel}>
        {t("stockSection.item.cancel")}
      </Button>
    </div>
  );
}
