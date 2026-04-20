import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { MenuItem } from "@/firebase/menu";
import type { CartItem } from "@/types";

type CompleteCheckoutParams = {
  uid: string;
  dayKey: string;
  items: (CartItem & { menu: MenuItem })[];
  totalMinor: number;
};

type StockRead = {
  stockId: string;
  itemName: string;
  currentQty: number;
  removeQty: number;
  nextQty: number;
};

function mergeItemSales(
  base: Record<string, number>,
  soldItems: { menuId: string; quantity: number }[]
) {
  const next = { ...base };

  for (const item of soldItems) {
    next[item.menuId] = (next[item.menuId] ?? 0) + item.quantity;
  }

  return next;
}

function getMostSoldItem(
  itemsSales: Record<string, number>
): string | null {
  let bestId: string | null = null;
  let bestQty = -1;

  for (const [menuId, qty] of Object.entries(itemsSales)) {
    if (qty > bestQty) {
      bestQty = qty;
      bestId = menuId;
    }
  }

  return bestId;
}

function buildStockDeductions(
  items: {
    menu: {
      ingredients?: { stockId: string; quantity: number }[];
    };
    quantity: number;
  }[]
) {
  const map = new Map<string, number>();

  for (const { menu, quantity } of items) {
    for (const ing of menu.ingredients ?? []) {
      const prev = map.get(ing.stockId) ?? 0;
      map.set(ing.stockId, prev + ing.quantity * quantity);
    }
  }

  return map;
}

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

  await runTransaction(db, async (tx) => {
    /* ─────────────────────────────── */
    /* READS ONLY                      */
    /* ─────────────────────────────── */

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
          totalTransactions?: number;
          unitsSoldTotal?: number;
          itemsSales?: Record<string, number>;
          lastSaleAt?: unknown;
        };
      };
    };

    const dayCycle = userData.nextillApp?.dayCycle;

    if (!dayCycle?.active) {
      throw new Error("Day is not active.");
    }

    if (dayCycle.dayKey !== dayKey) {
      throw new Error("Day key mismatch.");
    }

    const summarySnap = await tx.get(daySummaryRef);

    const currentDayEarnings = summarySnap.exists()
      ? Number(summarySnap.data().earnings ?? 0)
      : 0;

    const currentDayTransactions = summarySnap.exists()
      ? Number(summarySnap.data().transactions ?? 0)
      : 0;

    const currentDayUnitsSold = summarySnap.exists()
      ? Number(summarySnap.data().unitsSoldTotal ?? 0)
      : 0;

    const currentDayItemsSales = summarySnap.exists()
      ? ((summarySnap.data().itemsSales ?? {}) as Record<string, number>)
      : {};

    const currentGlobalStats = userData.nextillApp?.statistics ?? {};

    const currentGlobalEarnings = Number(currentGlobalStats.totalEarnings ?? 0);
    const currentGlobalTransactions = Number(
      currentGlobalStats.totalTransactions ?? 0
    );
    const currentGlobalUnitsSold = Number(
      currentGlobalStats.unitsSoldTotal ?? 0
    );
    const currentGlobalItemsSales =
      currentGlobalStats.itemsSales ?? {};

    const deductions = buildStockDeductions(
      items.map((i) => ({
        menu: i.menu,
        quantity: i.quantity,
      }))
    );

    const stockReads: StockRead[] = [];

    for (const [stockId, removeQty] of deductions) {
      const stockRef = doc(db, "users", uid, "stock", stockId);
      const stockSnap = await tx.get(stockRef);

      if (!stockSnap.exists()) {
        throw new Error("Stock item not found.");
      }

      const currentQty = Number(stockSnap.data().quantity ?? 0);
      const nextQty = currentQty - removeQty;

      stockReads.push({
        stockId,
        itemName: stockSnap.data().name,
        currentQty,
        removeQty,
        nextQty,
      });
    }

    const soldItems = items.map((i) => ({
      menuId: i.id,
      quantity: i.quantity,
    }));

    const nextDayItemsSales = mergeItemSales(currentDayItemsSales, soldItems);
    const nextGlobalItemsSales = mergeItemSales(
      currentGlobalItemsSales,
      soldItems
    );

    const dayMostSoldItem = getMostSoldItem(nextDayItemsSales);

    /* ─────────────────────────────── */
    /* WRITES ONLY                     */
    /* ─────────────────────────────── */

    for (const stock of stockReads) {
      const stockRef = doc(db, "users", uid, "stock", stock.stockId);
      const activityRef = doc(collection(db, "users", uid, "stockActivity"));

      tx.update(stockRef, {
        quantity: stock.nextQty,
        updatedAt: serverTimestamp(),
      });

      tx.set(activityRef, {
        stockId: stock.stockId,
        itemName: stock.itemName,
        action: "remove",
        quantityDelta: -stock.removeQty,
        quantityBefore: stock.currentQty,
        quantityAfter: stock.nextQty,
        createdAt: serverTimestamp(),
      });
    }

    tx.set(transactionRef, {
      createdAt: serverTimestamp(),
      dayKey,
      totalMinor,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      status: "completed",
      items: items.map((i) => ({
        menuId: i.id,
        name: i.menu.name,
        quantity: i.quantity,
        priceMinor: i.menu.priceMinor,
      })),
    });

    tx.set(
      daySummaryRef,
      {
        date: dayKey,
        earnings: currentDayEarnings + totalMinor,
        transactions: currentDayTransactions + 1,
        unitsSoldTotal: currentDayUnitsSold + items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        itemsSales: nextDayItemsSales,
        mostSoldItem: dayMostSoldItem,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    tx.update(userRef, {
      "nextillApp.statistics.totalEarnings":
        currentGlobalEarnings + totalMinor,
      "nextillApp.statistics.totalTransactions":
        currentGlobalTransactions + 1,
      "nextillApp.statistics.unitsSoldTotal":
        currentGlobalUnitsSold +
        items.reduce((sum, item) => sum + item.quantity, 0),
      "nextillApp.statistics.itemsSales": nextGlobalItemsSales,
      "nextillApp.statistics.lastSaleAt": serverTimestamp(),
    });
  });

  return true;
}

/*

import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { MenuItem } from "@/firebase/menu";
import type { CartItem } from "@/types";

type CompleteCheckoutParams = {
  uid: string;
  dayKey: string;
  items: (CartItem & { menu: MenuItem })[];
  totalMinor: number;
};

type StockRead = {
  stockId: string;
  itemName: string;
  currentQty: number;
  removeQty: number;
  nextQty: number;
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

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists()) throw new Error("User profile not found.");

    const dayCycle = userSnap.data()?.nextillApp?.dayCycle;
    if (!dayCycle?.active) throw new Error("Day is not active.");
    if (dayCycle.dayKey !== dayKey) throw new Error("Day key mismatch.");

    const summarySnap = await tx.get(daySummaryRef);

    const currentEarnings = summarySnap.exists()
      ? Number(summarySnap.data().earnings ?? 0)
      : 0;

    const currentTransactions = summarySnap.exists()
      ? Number(summarySnap.data().transactions ?? 0)
      : 0;

    const deductions = buildStockDeductions(
      items.map((i) => ({
        menu: i.menu,
        quantity: i.quantity,
      }))
    );

    const stockReads: StockRead[] = [];

    for (const [stockId, removeQty] of deductions) {
      const stockRef = doc(db, "users", uid, "stock", stockId);
      const stockSnap = await tx.get(stockRef);

      if (!stockSnap.exists()) {
        throw new Error("Stock item not found.");
      }

      const currentQty = Number(stockSnap.data().quantity ?? 0);
      const nextQty = currentQty - removeQty;

      stockReads.push({
        stockId,
        itemName: stockSnap.data().name,
        currentQty,
        removeQty,
        nextQty,
      });
    }

    for (const stock of stockReads) {
      const stockRef = doc(db, "users", uid, "stock", stock.stockId);
      const activityRef = doc(collection(db, "users", uid, "stockActivity"));

      tx.update(stockRef, {
        quantity: stock.nextQty,
        updatedAt: serverTimestamp(),
      });

      tx.set(activityRef, {
        stockId: stock.stockId,
        itemName: stock.itemName,
        action: "remove",
        quantityDelta: -stock.removeQty,
        quantityBefore: stock.currentQty,
        quantityAfter: stock.nextQty,
        createdAt: serverTimestamp(),
      });
    }

    tx.set(transactionRef, {
      createdAt: serverTimestamp(),
      dayKey,
      totalMinor,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      status: "completed",
      items: items.map((i) => ({
        menuId: i.id,
        name: i.menu.name,
        quantity: i.quantity,
        priceMinor: i.menu.priceMinor,
      })),
    });

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
  });

  return true;
}

function buildStockDeductions(
  items: {
    menu: {
      ingredients?: { stockId: string; quantity: number }[];
    };
    quantity: number;
  }[]
) {
  const map = new Map<string, number>();

  for (const { menu, quantity } of items) {
    for (const ing of menu.ingredients ?? []) {
      const prev = map.get(ing.stockId) ?? 0;
      map.set(ing.stockId, prev + ing.quantity * quantity);
    }
  }

  return map;
}







*/
