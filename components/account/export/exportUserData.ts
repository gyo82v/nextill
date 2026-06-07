import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export type ExportUserDataResult = {
  user: {
    email?: string | null;
    username?: string | null;
    emailConfirmed?: boolean | null;
  };
  settings: {
    dayActive?: boolean | null;
    language?: string | null;
    currency?: string | null;
    staffTicketPrinting?: boolean | null;
    receiptPrinting?: boolean | null;
    balanceEnabled?: boolean | null;
    motionReduced?: boolean | null;
  };
  menuItems: Array<Record<string, unknown>>;
  stockItems: Array<Record<string, unknown>>;
  reports: Array<Record<string, unknown>>;
};

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function normalizeDoc<T extends Record<string, unknown>>(docSnap: {
  id: string;
  data: () => Record<string, unknown>;
}): T {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as T;
}

async function fetchCollectionByUid<T extends Record<string, unknown>>(
  collectionName: string,
  uid: string
): Promise<T[]> {
  const ref = collection(db, collectionName);
  const q = query(ref, where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => normalizeDoc<T>(docSnap));
}

/**
 * Fetches the raw data needed to build an export report.
 *
 * Assumptions used here:
 * - user profile lives in `users/{uid}`
 * - menu items live in a top-level `menu` collection and may contain `uid`
 * - stock items live in a top-level `stock` collection and may contain `uid`
 * - reports live in a top-level `reports` collection and may contain `uid`
 *
 * If your schema differs, adjust the collection names and field names here only.
 */
export async function exportUserData(uid: string): Promise<ExportUserDataResult> {
  if (!uid) {
    throw new Error("Missing user id.");
  }

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User profile not found.");
  }

  const userData = userSnap.data() as Record<string, unknown>;
  const nextillApp = (userData.nextillApp as Record<string, unknown> | undefined) ?? {};
  const settings = (nextillApp.settings as Record<string, unknown> | undefined) ?? {};
  const dayCycle = (nextillApp.dayCycle as Record<string, unknown> | undefined) ?? {};

  const menuItems = await fetchCollectionByUid<Record<string, unknown>>("menu", uid);
  const stockItems = await fetchCollectionByUid<Record<string, unknown>>("stock", uid);
  const reports = await fetchCollectionByUid<Record<string, unknown>>("reports", uid);

  return {
    user: {
      email: readString(userData.email),
      username: readString(userData.displayName),
      emailConfirmed: readBoolean(userData.emailVerified),
    },
    settings: {
      dayActive: readBoolean(dayCycle.active),
      language: readString(settings.language),
      currency: readString(settings.currency),
      staffTicketPrinting: readBoolean(settings.staffTicketPrinting),
      receiptPrinting: readBoolean(settings.receiptPrinting),
      balanceEnabled: readBoolean(settings.balanceEnabled),
      motionReduced: readBoolean(settings.motionReduced),
    },
    menuItems,
    stockItems,
    reports,
  };
}
