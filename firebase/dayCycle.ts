import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { StartDayProps, EndDayProps } from "@/types";

export async function startDay({uid, openingBalance}: StartDayProps) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.dayCycle": {
      active: true,
      startedAt: serverTimestamp(),
      endedAt: null,
      openingBalance,
      closingBalance: null,
    },
  });
}

export async function endDay({uid, closingBalance}: EndDayProps) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.dayCycle.active": false,
    "nextillApp.dayCycle.endedAt": serverTimestamp(),
    "nextillApp.dayCycle.closingBalance": closingBalance,
  });
}