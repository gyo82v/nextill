import {
  collection,
  doc,
  getDocs,
  writeBatch,
  query,
  where
} from "firebase/firestore";
import { db } from "./firebase";
import type { DocumentReference } from "firebase/firestore";

const BATCH_LIMIT = 500;

// delete functions

export async function resetMenu(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const menuRef = collection(db, "users", uid, "menuItems");
  const snap = await getDocs(menuRef);

  if (snap.empty) return 0;

  let processed = 0;
  const docs = snap.docs;

  for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
    const chunk = docs.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    chunk.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    await batch.commit();
    processed += chunk.length;
  }

  return processed;
}

export async function resetReports(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const dailyRef = collection(db, "users", uid, "dailySummaries");
  const statsRef = doc(db, "users", uid, "nextillApp", "statistics");

  const dailySnap = await getDocs(dailyRef);
  const allRefs = [...dailySnap.docs.map((d) => d.ref), statsRef];

  let processed = 0;

  for (let i = 0; i < allRefs.length; i += BATCH_LIMIT) {
    const chunk = allRefs.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    for (const ref of chunk) {
      batch.delete(ref);
    }

    await batch.commit();
    processed += chunk.length;
  }

  return processed;
}

export async function resetStock(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const stockRef = collection(db, "users", uid, "stock");
  const activityRef = collection(db, "users", uid, "stockActivity");

  const [stockSnap, activitySnap] = await Promise.all([
    getDocs(stockRef),
    getDocs(activityRef),
  ]);

  const allDocs = [...stockSnap.docs, ...activitySnap.docs];

  if (allDocs.length === 0) return 0;

  let processed = 0;

  for (let i = 0; i < allDocs.length; i += BATCH_LIMIT) {
    const chunk = allDocs.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    for (const docSnap of chunk) {
      batch.delete(docSnap.ref);
    }

    await batch.commit();
    processed += chunk.length;
  }
  return processed;
}

export async function resetAllData(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const reports = await resetReports(uid);
  const stock = await resetStock(uid);
  const menu = await resetMenu(uid);

  return {
    reports,
    stock,
    menu,
    total: reports + stock + menu,
  };
}

//archieve functions

async function deleteRefsInChunks(refs: DocumentReference[]) {
  if (refs.length === 0) return 0;

  let processed = 0;

  for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
    const chunk = refs.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    for (const ref of chunk) {
      batch.delete(ref);
    }

    await batch.commit();
    processed += chunk.length;
  }

  return processed;
}

export async function deleteArchivedMenuItems(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const menuRef = collection(db, "users", uid, "menuItems");
  const snap = await getDocs(query(menuRef, where("active", "==", false)));

  return deleteRefsInChunks(snap.docs.map((d) => d.ref));
}

export async function deleteArchivedStockItems(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const stockRef = collection(db, "users", uid, "stock");
  const snap = await getDocs(query(stockRef, where("active", "==", false)));

  return deleteRefsInChunks(snap.docs.map((d) => d.ref));
}

export async function deleteArchivedMenuAndStockItems(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const menuRef = collection(db, "users", uid, "menuItems");
  const stockRef = collection(db, "users", uid, "stock");

  const [menuSnap, stockSnap] = await Promise.all([
    getDocs(query(menuRef, where("active", "==", false))),
    getDocs(query(stockRef, where("active", "==", false))),
  ]);

  const refs = [
    ...menuSnap.docs.map((d) => d.ref),
    ...stockSnap.docs.map((d) => d.ref),
  ];

  return deleteRefsInChunks(refs);
}



/*

export async function resetTransactions(uid: string) {
  if (!uid) throw new Error("Missing user id");

  const batch = writeBatch(db);

  const txRef = collection(db, "users", uid, "transactions");
  const snap = await getDocs(txRef);

  snap.forEach((d) => batch.delete(d.ref));

  await batch.commit();
}



 */