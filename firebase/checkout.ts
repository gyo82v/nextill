import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { deductStockFromSale } from "./stock";

export type CheckoutItem = {
  id: string;
  name: string;
  quantity: number;
};

type CompleteCheckoutParams = {
  uid: string;
  dayKey: string;
  items: CheckoutItem[];
  totalMinor: number;
};

export async function completeCheckout({
  uid,
  dayKey,
  items,
  totalMinor,
}: CompleteCheckoutParams) {
  if (!uid) throw new Error("Missing user id.");
  if (!dayKey) throw new Error("Missing day key.");
  if (!items.length) throw new Error("Cart is empty.");

  const userRef = doc(db, "users", uid);
  const daySummaryRef = doc(collection(userRef, "dailySummaries"), dayKey);
  const transactionsColRef = collection(daySummaryRef, "transactions");
  const transactionRef = doc(transactionsColRef);

  let stockItemsToDeduct: {
    stockId: string;
    quantity: number;
  }[] = [];

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

    const nextTotalEarnings =
      Number(currentStats?.totalEarnings ?? 0) + totalMinor;

    const nextTotalTransactions =
      Number(currentStats?.totalTransactionsNumber ?? 0) + 1;

    // 1. write transaction
    tx.set(transactionRef, {
      createdAt: serverTimestamp(),
      dayKey,
      totalMinor,
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      status: "completed",
    });

    // 2. update daily summary
    tx.set(
      daySummaryRef,
      {
        date: dayKey,
        earnings: currentEarnings + totalMinor,
        transactions: currentTransactions + 1,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 3. update user stats
    tx.update(userRef, {
      "nextillApp.statistics.totalEarnings": nextTotalEarnings,
      "nextillApp.statistics.totalTransactionsNumber":
        nextTotalTransactions,
    });

    // 4. prepare stock deduction (NO FIREBASE CALL HERE)
    stockItemsToDeduct = items.map((i) => ({
      stockId: i.id,
      quantity: i.quantity,
    }));
  });

  // 5. AFTER transaction → side effect
  await deductStockFromSale(uid, stockItemsToDeduct);

  return true;
}