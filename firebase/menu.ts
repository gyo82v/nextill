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
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type MenuCategory = "food" | "drink";

export interface MenuIngredient {
  stockId: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients: MenuIngredient[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateMenuItemInput = {
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients?: MenuIngredient[];
};

export type UpdateMenuItemInput = Partial<{
  name: string;
  priceMinor: number;
  category: MenuCategory;
  ingredients: MenuIngredient[];
}>;

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



/*
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

export async function createMenuItem(
  uid: string,
  input: {
    name: string;
    priceMinor: number;
    category: MenuCategory;
  }
) {
  if (!uid) throw new Error("Missing user id.");
  if (!input.name.trim()) throw new Error("Name required.");
  if (!Number.isInteger(input.priceMinor) || input.priceMinor <= 0) {
    throw new Error("Invalid price.");
  }

export async function updateMenuItem(
  uid: string,
  menuId: string,
  patch: Partial<Pick<MenuItem, "name" | "priceMinor" | "category" | "ingredients">>
) {
  const ref = doc(menuCol(uid), menuId);

  await updateDoc(ref, {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}




*/