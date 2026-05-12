import type { StockActivityItemProps } from "@/types"
import Button from "../ui/Button"
import { FiTrash2 } from "react-icons/fi";

export default function StockActivityCard({activity, onDelete}:StockActivityItemProps){
    return(
        <article className="flex justify-between w-full">
            <div className="space-y-1">
                <div className="font-medium">{activity.itemName}</div>
                <div className="opacity-80">
                  {activity.action} {Math.abs(activity.quantityDelta)} (
                  {activity.quantityBefore} → {activity.quantityAfter})
                </div>
            </div>

            <Button
              variant="danger"
              type="button"
              onClick={() => onDelete(activity.id)}
              loading={false}
              loadingText="deleting"
              title="delete activity"
              aria-label="delete activity"
            >
              <FiTrash2 className="h-4 w-4" />
              <span className="hidden lg:block">Delete</span>
            </Button>
        </article>
    )
}