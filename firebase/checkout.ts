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

      if (nextQty < 0) {
        throw new Error(`Insufficient stock for ${stockSnap.data().name}`);
      }

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
