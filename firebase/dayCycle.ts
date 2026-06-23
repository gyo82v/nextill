import { doc, updateDoc, serverTimestamp, collection, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { StartDayProps, EndDayProps } from "@/types";

export async function startDay({
  uid,
  openingBalance,
}: StartDayProps) {
  const ref = doc(db, "users", uid);
  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  await updateDoc(ref, {
    "nextillApp.dayCycle": {
      active: true,
      dayKey,
      startedAt: serverTimestamp(),
      endedAt: null,
      openingBalance,
      closingBalance: null,
      nextTicketNumber: 1,
    },
  });
}

export async function endDay({ uid, closingBalance }: EndDayProps) {
  const userRef = doc(db, "users", uid);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User profile not found.");
  }

  const userData = userSnap.data() as {
    nextillApp?: {
      dayCycle?: {
        dayKey?: string | null;
        openingBalance?: number | null;
      };
      settings?: {
        balanceEnabled?: boolean;
      };
    };
  };

  const dayCycle = userData.nextillApp?.dayCycle;
  const dayKey = dayCycle?.dayKey;

  if (!dayKey) {
    throw new Error("Missing current day key.");
  }

  const balanceEnabled = Boolean(userData.nextillApp?.settings?.balanceEnabled);

  const daySummaryRef = doc(collection(userRef, "dailySummaries"), dayKey);

  if (balanceEnabled) {
    await setDoc(
      daySummaryRef,
      {
        openingBalance: Number(dayCycle?.openingBalance ?? 0),
        closingBalance,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  await updateDoc(userRef, {
    "nextillApp.dayCycle.active": false,
    "nextillApp.dayCycle.endedAt": serverTimestamp(),
    "nextillApp.dayCycle.closingBalance": closingBalance,
    "nextillApp.dayCycle.dayKey": null,
  });
}



/*

export async function endDay({
  uid,
  closingBalance,
}: EndDayProps) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.dayCycle.active": false,
    "nextillApp.dayCycle.endedAt": serverTimestamp(),
    "nextillApp.dayCycle.closingBalance": closingBalance,
    "nextillApp.dayCycle.dayKey": null,
  });
}




*/
