import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export async function resetStatistics(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const batch = writeBatch(db);

  // daily summaries
  const dailyRef = collection(db, "users", uid, "dailySummaries");
  const dailySnap = await getDocs(dailyRef);

  dailySnap.forEach((d) => batch.delete(d.ref));

  // global statistics
  const statsRef = doc(db, "users", uid, "nextillApp", "statistics");
  batch.delete(statsRef);

  await batch.commit();
}

export async function resetStock(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const batch = writeBatch(db);

  const stockRef = collection(db, "users", uid, "stock");
  const activityRef = collection(db, "users", uid, "stockActivity");

  const [stockSnap, activitySnap] = await Promise.all([
    getDocs(stockRef),
    getDocs(activityRef),
  ]);

  stockSnap.forEach((d) => batch.delete(d.ref));
  activitySnap.forEach((d) => batch.delete(d.ref));

  await batch.commit();
}


export async function resetMenu(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const batch = writeBatch(db);

  const menuRef = collection(db, "users", uid, "menu");
  const snap = await getDocs(menuRef);

  snap.forEach((d) => batch.delete(d.ref));

  await batch.commit();
}

export async function resetTransactions(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const batch = writeBatch(db);

  const txRef = collection(db, "users", uid, "transactions");
  const snap = await getDocs(txRef);

  snap.forEach((d) => batch.delete(d.ref));

  await batch.commit();
}

export async function resetAllData(uid: string) {
  if (!uid) throw new Error("Missing user id");

  await resetStatistics(uid);
  await resetStock(uid);
  await resetMenu(uid);
  await resetTransactions(uid);
}