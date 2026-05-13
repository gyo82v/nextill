import Button from "../ui/Button"
import type { StockThresholdEditProps } from "@/types"
import { inputBaseStyle } from "@/styles"

export default function ThresholdEdit({
    minQty, setMinQty, handleSave, handleCancel, savingThreshold
}:StockThresholdEditProps){
    return(
        <div className="flex items-center gap-2 ">
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
              loading={false}
              variant="secondary"
            >
                Save
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              >
                Cancel
            </Button>
        </div>
    )
}