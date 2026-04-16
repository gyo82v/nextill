import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  type Timestamp,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

export type StockCategory = "food" | "drink";
export type StockAction = "add" | "remove";

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StockActivity {
  id: string;
  stockId: string;
  itemName: string;
  action: StockAction;
  quantityDelta: number;
  quantityBefore: number;
  quantityAfter: number;
  createdAt: Timestamp;
}

export type CreateStockItemInput = {
  name: string;
  category: StockCategory;
  quantity: number;
  unit: string;
};

const stockItemsCol = (uid: string) =>
  collection(db, "users", uid, "stock");

const stockActivityCol = (uid: string) =>
  collection(db, "users", uid, "stockActivity");

export async function listStockItems(uid: string) {
  const q = query(stockItemsCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as StockItem[];
}

export async function listStockActivity(uid: string) {
  const q = query(stockActivityCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as StockActivity[];
}

export async function createStockItem(
  uid: string,
  input: CreateStockItemInput
) {
  if (!uid) throw new Error("Missing user id.");
  if (!input.name.trim()) throw new Error("Stock name is required.");
  if (!Number.isInteger(input.quantity) || input.quantity < 0) {
    throw new Error("Quantity must be a non-negative integer.");
  }

  const stockRef = doc(stockItemsCol(uid));
  const activityRef = doc(stockActivityCol(uid));

  await runTransaction(db, async (tx) => {
    tx.set(stockRef, {
      name: input.name.trim(),
      category: input.category,
      quantity: input.quantity,
      unit: input.unit.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    tx.set(activityRef, {
      stockId: stockRef.id,
      itemName: input.name.trim(),
      action: "add",
      quantityDelta: input.quantity,
      quantityBefore: 0,
      quantityAfter: input.quantity,
      createdAt: serverTimestamp(),
    });
  });

  return stockRef.id;
}

export async function confirmStockAdjustment(
  uid: string,
  stockId: string,
  delta: number
) {
  if (!uid) throw new Error("Missing user id.");
  if (!stockId) throw new Error("Missing stock id.");
  if (!Number.isInteger(delta) || delta === 0) {
    throw new Error("Adjustment must be a non-zero integer.");
  }

  const stockRef = doc(stockItemsCol(uid), stockId);
  const activityRef = doc(stockActivityCol(uid));

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(stockRef);

    if (!snap.exists()) {
      throw new Error("Stock item not found.");
    }

    const current = snap.data() as Omit<StockItem, "id">;
    const quantityBefore = Number(current.quantity ?? 0);
    const quantityAfter = quantityBefore + delta;

    if (quantityAfter < 0) {
      throw new Error("Stock cannot go below zero.");
    }

    tx.update(stockRef, {
      quantity: quantityAfter,
      updatedAt: serverTimestamp(),
    });

    tx.set(activityRef, {
      stockId,
      itemName: current.name,
      action: delta > 0 ? "add" : "remove",
      quantityDelta: delta,
      quantityBefore,
      quantityAfter,
      createdAt: serverTimestamp(),
    });
  });
}

export async function deleteStockItem(uid: string, stockId: string) {
  if (!uid) throw new Error("Missing user id.");
  if (!stockId) throw new Error("Missing stock id.");

  const stockRef = doc(stockItemsCol(uid), stockId);
  const activityRef = doc(stockActivityCol(uid));

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(stockRef);

    if (!snap.exists()) {
      throw new Error("Stock item not found.");
    }

    const current = snap.data() as Omit<StockItem, "id">;
    const quantityBefore = Number(current.quantity ?? 0);

    tx.delete(stockRef);

    tx.set(activityRef, {
      stockId,
      itemName: current.name,
      action: "remove",
      quantityDelta: -quantityBefore,
      quantityBefore,
      quantityAfter: 0,
      createdAt: serverTimestamp(),
    });
  });
}

export async function deleteStockActivity(
  uid: string,
  activityId: string
) {
  if (!uid) throw new Error("Missing user id.");
  if (!activityId) throw new Error("Missing activity id.");

  const ref = doc(stockActivityCol(uid), activityId);
  await deleteDoc(ref);
}

export async function clearStockActivity(uid: string) {
  if (!uid) throw new Error("Missing user id.");

  const snap = await getDocs(stockActivityCol(uid));

  const deletions = snap.docs.map((d) =>
    deleteDoc(doc(stockActivityCol(uid), d.id))
  );

  await Promise.all(deletions);
}

/* -------------------------
   Realtime subscriptions
-------------------------- */

export function subscribeStockItems(
  uid: string,
  onChange: (items: StockItem[]) => void
) {
  const q = query(stockItemsCol(uid), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as StockItem[];

    onChange(items);
  });
}

export function subscribeStockActivity(
  uid: string,
  onChange: (activity: StockActivity[]) => void
) {
  const q = query(stockActivityCol(uid), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const activity = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as StockActivity[];

    onChange(activity);
  });
}

export async function deductStockFromSale(
  uid: string,
  items: {
    stockId: string;
    quantity: number;
    itemName?: string;
  }[]
) {
  if (!uid) throw new Error("Missing user id.");
  if (!items.length) return;

  const batch = writeBatch(db);

  const activityCol = stockActivityCol(uid);

  for (const item of items) {
    const stockRef = doc(stockItemsCol(uid), item.stockId);

    // We need to read current state first → transaction safety
    const snap = await getDocs(stockItemsCol(uid));
    const stock = snap.docs.find((d) => d.id === item.stockId);

    if (!stock) continue;

    const current = stock.data() as StockItem;

    const quantityBefore = current.quantity;
    const quantityAfter = quantityBefore - item.quantity;

    if (quantityAfter < 0) {
      throw new Error(`Not enough stock for ${current.name}`);
    }

    batch.update(stockRef, {
      quantity: quantityAfter,
      updatedAt: serverTimestamp(),
    });

    const activityRef = doc(activityCol);

    batch.set(activityRef, {
      stockId: item.stockId,
      itemName: current.name,
      action: "remove",
      quantityDelta: -item.quantity,
      quantityBefore,
      quantityAfter,
      createdAt: serverTimestamp(),
    });
  }

  await batch.commit();
}