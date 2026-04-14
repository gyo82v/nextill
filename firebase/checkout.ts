import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CompleteCheckoutParams = {
  uid: string;
  dayKey: string;
  items: CheckoutItem[];
  total: number;
};

export async function completeCheckout({
  uid,
  dayKey,
  items,
  total,
}: CompleteCheckoutParams) {
  if (!uid) throw new Error("Missing user id.");
  if (!dayKey) throw new Error("Missing day key.");
  if (!items.length) throw new Error("Cart is empty.");

  const userRef = doc(db, "users", uid);
  const daySummaryRef = doc(collection(userRef, "dailySummaries"), dayKey);
  const transactionsColRef = collection(daySummaryRef, "transactions");
  const transactionRef = doc(transactionsColRef);

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }

    const userData = userSnap.data() as {
      nextillApp?: {
        dayCycle?: {
          active?: boolean;
          dayKey?: string | null;
        };
        statistics?: {
          totalEarnings?: number;
          totalTransactionsNumber?: number;
        };
      };
    };

    const dayCycle = userData.nextillApp?.dayCycle;

    if (!dayCycle?.active) {
      throw new Error("Day is not active.");
    }

    if (dayCycle.dayKey && dayCycle.dayKey !== dayKey) {
      throw new Error("Day key mismatch.");
    }

    const summarySnap = await tx.get(daySummaryRef);

    const currentEarnings =
      summarySnap.exists() ? Number(summarySnap.data().earnings ?? 0) : 0;

    const currentTransactions =
      summarySnap.exists() ? Number(summarySnap.data().transactions ?? 0) : 0;

    const currentStats = userData.nextillApp?.statistics;

    const nextTotalEarnings = Number(currentStats?.totalEarnings ?? 0) + total;
    const nextTotalTransactions =
      Number(currentStats?.totalTransactionsNumber ?? 0) + 1;

    tx.set(transactionRef, {
      createdAt: serverTimestamp(),
      dayKey,
      total,
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      status: "completed",
    });

    tx.set(
      daySummaryRef,
      {
        date: dayKey,
        earnings: currentEarnings + total,
        transactions: currentTransactions + 1,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Optional: keep cached global totals in the user profile
    tx.update(userRef, {
      "nextillApp.statistics.totalEarnings": nextTotalEarnings,
      "nextillApp.statistics.totalTransactionsNumber": nextTotalTransactions,
    });
  });

  return true;
}