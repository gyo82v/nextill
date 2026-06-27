import {
  addDoc,
  setDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Discount,
  CreateDiscountInput,
  UpdateDiscountInput,
} from "@/types/discount";


const discountsCol = (uid: string) =>
  collection(db, "users", uid, "discounts");

/* -------------------------
   Read
-------------------------- */

export async function listDiscounts(uid: string) {
  if (!uid) throw new Error("Missing user id.");

  const q = query(discountsCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Discount[];
}

export async function listActiveDiscounts(uid: string) {
  if (!uid) throw new Error("Missing user id.");

  const q = query(discountsCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs
    .map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Discount, "id">),
    }))
    .filter((discount) => discount.active !== false) as Discount[];
}

export function subscribeDiscounts(
  uid: string,
  onChange: (discounts: Discount[]) => void
) {
  if (!uid) throw new Error("Missing user id.");

  const q = query(discountsCol(uid), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const discounts = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Discount[];

    onChange(discounts);
  });
}

/* -------------------------
   Create
-------------------------- */

export async function createDiscount(
  userId: string,
  input: CreateDiscountInput
) {
  if (!userId) throw new Error("Missing user id.");

  if (input.type === "flat") {
    if (typeof input.valueMinor !== "number") {
      throw new Error("Discount value must be a number.");
    }
  }

  if (input.type === "percentage") {
    if (typeof input.percentage !== "number") {
      throw new Error("Discount value must be a number.");
    }
  }

  const ref = doc(collection(db, "users", userId, "discounts"));

  await setDoc(ref, {
    ...input,
    active: input.active ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/* -------------------------
   Update
-------------------------- */

export async function updateDiscount(
  userId: string,
  discountId: string,
  input: UpdateDiscountInput
) {
  if (!userId) throw new Error("Missing user id.");
  if (!discountId) throw new Error("Missing discount id.");

  if (input.type === "flat" && input.valueMinor !== undefined) {
    if (typeof input.valueMinor !== "number") {
      throw new Error("Discount value must be a number.");
    }
  }

  if (input.type === "percentage" && input.percentage !== undefined) {
    if (typeof input.percentage !== "number") {
      throw new Error("Discount value must be a number.");
    }
  }

  const ref = doc(db, "users", userId, "discounts", discountId);

  await updateDoc(ref, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/* -------------------------
   Archive / Delete
-------------------------- */

export async function archiveDiscount(uid: string, discountId: string) {
  if (!uid) throw new Error("Missing user id.");
  if (!discountId) throw new Error("Missing discount id.");

  const ref = doc(discountsCol(uid), discountId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);

    if (!snap.exists()) {
      throw new Error("Discount not found.");
    }

    const current = snap.data() as Omit<Discount, "id">;

    if (current.active === false) {
      return; // already archived
    }

    tx.update(ref, {
      active: false,
      archivedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function deleteDiscount(uid: string, discountId: string) {
  if (!uid) throw new Error("Missing user id.");
  if (!discountId) throw new Error("Missing discount id.");

  const ref = doc(discountsCol(uid), discountId);
  await deleteDoc(ref);
}
