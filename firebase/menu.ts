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
import type { MenuIngredient, MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from "@/types/menu";


const menuCol = (uid: string) => collection(db, "users", uid, "menuItems");

function normalizeIngredients(ingredients?: MenuIngredient[]) {
  return (ingredients ?? [])
    .filter((i) => i.stockId.trim() && Number.isInteger(i.quantity) && i.quantity > 0)
    .map((i) => ({
      stockId: i.stockId.trim(),
      quantity: i.quantity,
    }));
}

export async function listMenuItems(uid: string) {
  const q = query(menuCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MenuItem[];
}

export async function createMenuItem(uid: string, input: CreateMenuItemInput) {
  if (!uid) throw new Error("Missing user id.");
  if (!input.name.trim()) throw new Error("Name required.");
  if (!Number.isInteger(input.priceMinor) || input.priceMinor <= 0) {
    throw new Error("Invalid price.");
  }

  await addDoc(menuCol(uid), {
    name: input.name.trim(),
    priceMinor: input.priceMinor,
    category: input.category,
    ingredients: normalizeIngredients(input.ingredients),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateMenuItem(
  uid: string,
  menuId: string,
  patch: UpdateMenuItemInput
) {
  const ref = doc(menuCol(uid), menuId);

  await updateDoc(ref, {
    ...patch,
    ...(patch.ingredients ? { ingredients: normalizeIngredients(patch.ingredients) } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMenuItem(uid: string, menuId: string) {
  await deleteDoc(doc(menuCol(uid), menuId));
}

export async function clearMenuItems(uid: string) {
  const items = await listMenuItems(uid);
  await Promise.all(items.map((item) => deleteDoc(doc(menuCol(uid), item.id))));
}
