import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { StartDayProps, EndDayProps } from "@/types";

/**
 * Start business day
 * Creates a stable dayKey (YYYY-MM-DD)
 */
export async function startDay({ uid, openingBalance }: StartDayProps) {
  const ref = doc(db, "users", uid);

  // Stable, human-readable day identifier
  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  await updateDoc(ref, {
    "nextillApp.dayCycle": {
      active: true,
      dayKey,
      startedAt: serverTimestamp(),
      endedAt: null,
      openingBalance,
      closingBalance: null,
    },
  });
}

/**
 * End business day
 */
export async function endDay({ uid, closingBalance }: EndDayProps) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.dayCycle.active": false,
    "nextillApp.dayCycle.endedAt": serverTimestamp(),
    "nextillApp.dayCycle.closingBalance": closingBalance,
    "nextillApp.dayCycle.dayKey": null,
  });
}