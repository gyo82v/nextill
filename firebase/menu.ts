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
import type { MenuItem } from "@/types/nextill";

const menuCol = (uid: string) => collection(db, "users", uid, "menuItems");

export async function listMenuItems(uid: string) {
  const q = query(menuCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MenuItem[];
}

export async function createMenuItem(
  uid: string,
  data: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
) {
  const ref = await addDoc(menuCol(uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateMenuItem(
  uid: string,
  menuId: string,
  patch: Partial<Omit<MenuItem, "id" | "createdAt" | "updatedAt">>
) {
  await updateDoc(doc(menuCol(uid), menuId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItem(uid: string, menuId: string) {
  await deleteDoc(doc(menuCol(uid), menuId));
}