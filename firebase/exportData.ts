import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

type CollectionPath = readonly string[];

export async function exportUserData(uid: string) {
  if (!uid) throw new Error("Missing user id");

  async function readCollection(path: CollectionPath) {
    const ref = collection(db, ...(path as [string, ...string[]]));
    const snap = await getDocs(ref);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  return {
    stock: await readCollection(["users", uid, "stock"]),
    stockActivity: await readCollection(["users", uid, "stockActivity"]),
    menu: await readCollection(["users", uid, "menu"]),
    transactions: await readCollection(["users", uid, "transactions"]),
    dailySummaries: await readCollection(["users", uid, "dailySummaries"]),
    statistics: await readCollection(["users", uid, "nextillApp"]),
  };
}