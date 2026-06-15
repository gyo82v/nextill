import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  runTransaction,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import type { MenuIngredient, MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from "@/types/menu";


const menuCol = (uid: string) => collection(db, "users", uid, "menuItems");
const BATCH_LIMIT = 450;

function normalizeIngredients(ingredients?: MenuIngredient[]) {
  return (ingredients ?? [])
    .filter((i) => i.stockId.trim() && Number.isInteger(i.quantity) && i.quantity > 0)
    .map((i) => ({
      stockId: i.stockId.trim(),
      quantity: i.quantity,
    }));
}

export async function listActiveMenuItems(uid: string): Promise<MenuItem[]> {
  const q = query(menuCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs
    .map((d): MenuItem => ({
      id: d.id,
      ...(d.data() as Omit<MenuItem, "id">),
    }))
    .filter((item) => item.active !== false);
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
  if (!uid) throw new Error("Missing user id.");
  if (!menuId) throw new Error("Missing menu id.");

  const menuRef = doc(menuCol(uid), menuId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(menuRef);

    if (!snap.exists()) {
      throw new Error("Menu item not found.");
    }

    const current = snap.data();

    if (current.active === false) {
      // already archived → no-op
      return;
    }

    tx.update(menuRef, {
      active: false,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function clearMenuItems(uid: string): Promise<number> {
  if (!uid) throw new Error("Missing user id.");

  const snap = await getDocs(query(menuCol(uid), orderBy("createdAt", "desc")));

  const items = snap.docs
    .map((d) => ({
      id: d.id,
      ...(d.data() as Omit<MenuItem, "id">),
    }))
    .filter((item) => item.active !== false)

  if (items.length === 0) return 0;

  let processed = 0;

  for (let i = 0; i < items.length; i += BATCH_LIMIT) {
    const chunk = items.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    for (const item of chunk) {
      const menuRef = doc(menuCol(uid), item.id);

      batch.update(menuRef, {
        active: false,
        archivedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    processed += chunk.length;
  }

  return processed;
}




/*


export async function deleteMenuItem(uid: string, menuId: string) {
  await deleteDoc(doc(menuCol(uid), menuId));
}

export async function clearMenuItems(uid: string) {
  const items = await listMenuItems(uid);
  await Promise.all(items.map((item) => deleteDoc(doc(menuCol(uid), item.id))));
}






*/
