import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function startDay(uid: string, openingBalance: number) {
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

export async function endDay(uid: string, closingBalance: number) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.dayCycle.active": false,
    "nextillApp.dayCycle.endedAt": serverTimestamp(),
    "nextillApp.dayCycle.closingBalance": closingBalance,
  });
}