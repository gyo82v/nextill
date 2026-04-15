import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { StockActivity, StockItem } from "@/types/nextill";

const stockCol = (uid: string) => collection(db, "users", uid, "stockItems");
const activityCol = (uid: string) => collection(db, "users", uid, "stockActivity");

export async function listStockItems(uid: string) {
  const q = query(stockCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as StockItem[];
}

async function addStockActivity(
  uid: string,
  activity: Omit<StockActivity, "id" | "createdAt">
) {
  await addDoc(activityCol(uid), {
    ...activity,
    createdAt: serverTimestamp(),
  });
}

export async function createStockItem(
  uid: string,
  data: Omit<StockItem, "id" | "createdAt" | "updatedAt">
) {
  const ref = await addDoc(stockCol(uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await addStockActivity(uid, {
    stockId: ref.id,
    stockName: data.name,
    type: "added",
    deltaQty: data.qty,
    beforeQty: 0,
    afterQty: data.qty,
  });

  return ref.id;
}

export async function updateStockItem(
  uid: string,
  stockId: string,
  patch: Partial<Omit<StockItem, "id" | "createdAt" | "updatedAt">>
) {
  const ref = doc(stockCol(uid), stockId);
  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });

  if (typeof patch.qty === "number") {
    await addStockActivity(uid, {
      stockId,
      stockName: patch.name ?? stockId,
      type: "updated",
      deltaQty: 0,
      beforeQty: patch.qty,
      afterQty: patch.qty,
    });
  }
}

export async function adjustStockQty(
  uid: string,
  stockId: string,
  stockName: string,
  beforeQty: number,
  deltaQty: number
) {
  const ref = doc(stockCol(uid), stockId);
  const afterQty = beforeQty + deltaQty;

  await updateDoc(ref, {
    qty: afterQty,
    updatedAt: serverTimestamp(),
  });

  await addStockActivity(uid, {
    stockId,
    stockName,
    type: deltaQty >= 0 ? "added" : "removed",
    deltaQty,
    beforeQty,
    afterQty,
  });
}

export async function deleteStockItem(
  uid: string,
  stockId: string,
  stockName: string,
  qty: number
) {
  await deleteDoc(doc(stockCol(uid), stockId));

  await addStockActivity(uid, {
    stockId,
    stockName,
    type: "deleted",
    deltaQty: -qty,
    beforeQty: qty,
    afterQty: 0,
  });
}

export async function listStockActivity(uid: string) {
  const q = query(activityCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as StockActivity[];
}