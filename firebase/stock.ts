import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { StockItem, StockActivity, CreateStockItemInput } from "@/types/stock";


const stockItemsCol = (uid: string) =>
  collection(db, "users", uid, "stock");

const stockActivityCol = (uid: string) =>
  collection(db, "users", uid, "stockActivity");

const BATCH_LIMIT = 250; // 1 stock update + 1 activity write per item = 2 writes/item

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
      minQty: input.minQty ?? 5,
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

/* -------------------------
   delete function
-------------------------- */


export async function archiveStockItem(uid: string, stockId: string) {
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

    if (current.active === false) {
      // already archived → no-op
      return;
    }

    const quantityBefore = Number(current.quantity ?? 0);

    tx.update(stockRef, {
      active: false,
      quantity: quantityBefore, // keep last known quantity
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    tx.set(activityRef, {
      stockId,
      itemName: current.name,
      action: "archive",
      quantityDelta: 0,
      quantityBefore,
      quantityAfter: quantityBefore,
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

export async function clearStockItems(uid: string) {
  if (!uid) throw new Error("Missing user id.");

  const snap = await getDocs(query(stockItemsCol(uid)));

  const items = snap.docs
    .map((d) => ({
      id: d.id,
      ...(d.data() as Omit<StockItem, "id">),
    }))
    .filter((item) => item.active !== false); // includes missing active field

  if (items.length === 0) return 0;

  let processed = 0;

  for (let i = 0; i < items.length; i += BATCH_LIMIT) {
    const chunk = items.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    for (const item of chunk) {
      const stockRef = doc(stockItemsCol(uid), item.id);
      const activityRef = doc(stockActivityCol(uid));

      const quantityBefore = Number(item.quantity ?? 0);

      batch.update(stockRef, {
        active: false,
        quantity: quantityBefore,
        archivedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      batch.set(activityRef, {
        stockId: item.id,
        itemName: item.name,
        action: "archive",
        quantityDelta: 0,
        quantityBefore,
        quantityAfter: quantityBefore,
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();
    processed += chunk.length;
  }

  return processed;
}

export async function updateStockMinQty(
  uid: string,
  stockId: string,
  minQty: number
) {
  if (!uid) throw new Error("Missing user id.");
  if (!stockId) throw new Error("Missing stock id.");
  if (!Number.isInteger(minQty) || minQty < 0) {
    throw new Error("minQty must be a non-negative integer.");
  }

  const ref = doc(db, "users", uid, "stock", stockId);

  await updateDoc(ref, {
    minQty,
    updatedAt: serverTimestamp(),
  });
}

/* -------------------------
   Realtime subscriptions
-------------------------- */

export function subscribeStockItems(
  uid: string,
  onChange: (items: StockItem[]) => void
) {
  const q = query(
    stockItemsCol(uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const items = snap.docs
      .map((d) => ({
        id: d.id,
        ...(d.data() as Omit<StockItem, "id">),
      }))
      .filter((item) => item.active !== false) as StockItem[];

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
