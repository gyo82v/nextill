import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebase";
import type { ExportUserDataResult } from "@/types";
import type {
  RawDailySummaryForExport,
  RawMenuItemForExport,
  RawStockActivityForExport,
  RawStockItemForExport,
} from "@/types";

function readString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function readBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function normalizeDoc<T extends Record<string, unknown>>(docSnap: {
  id: string;
  data: () => Record<string, unknown>;
}): T {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as unknown as T;
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

async function fetchNestedCollection<T extends Record<string, unknown>>(
  parentCollection: string,
  uid: string,
  nestedCollection: string
): Promise<T[]> {
  const ref = collection(db, parentCollection, uid, nestedCollection);
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((docSnap) => normalizeDoc<T>(docSnap));
}
export async function exportUserData(uid: string): Promise<ExportUserDataResult> {
  if (!uid) {
    throw new Error("Missing user id.");
  }

  const auth = getAuth();
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User profile not found.");
  }

  const userData = userSnap.data() as Record<string, unknown>;
  const nextillApp = (userData.nextillApp as Record<string, unknown> | undefined) ?? {};
  const settings = (nextillApp.settings as Record<string, unknown> | undefined) ?? {};
  const dayCycle = (nextillApp.dayCycle as Record<string, unknown> | undefined) ?? {};
  const statistics = (nextillApp.statistics as Record<string, unknown> | undefined) ?? {};

  const menuItems = await fetchCollectionByUid<RawMenuItemForExport>("menuItems", uid);
  const stockItems = await fetchCollectionByUid<RawStockItemForExport>("stock", uid);
  const dailySummaries = await fetchNestedCollection<RawDailySummaryForExport>(
    "users",
    uid,
    "dailySummaries"
  );
  const stockActivity = await fetchNestedCollection<RawStockActivityForExport>(
    "users",
    uid,
    "stockActivity"
  );

  return {
    user: {
      email: readString(userData.email),
      username: readString(userData.displayName),
      createdAt: userData.createdAt,
      emailConfirmed: auth.currentUser?.emailVerified ?? null,
    },
    settings: {
      dayActive: readBoolean(settings.dayActive),
      dayDate: readString(settings.dayDate),
      language: readString(settings.language),
      currency: readString(settings.currency),
      darkMode: readBoolean(settings.darkMode),
      balanceEnabled: readBoolean(settings.balanceEnabled),
      ticketEnabled: readBoolean(settings.ticketEnabled),
      receiptEnabled: readBoolean(settings.receiptEnabled),
      disableMotion: readBoolean(settings.disableMotion),
    },
    dayCycle: {
      startedAt: dayCycle.startedAt ?? null,
      endedAt: dayCycle.endedAt ?? null,
      openingBalance: readNumber(dayCycle.openingBalance),
      closingBalance: readNumber(dayCycle.closingBalance),
      dayKey: readString(dayCycle.dayKey),
      nextTicketNumber: readNumber(dayCycle.nextTicketNumber),
    },
    statistics: {
      itemsSales: (statistics.itemsSales as Record<string, number> | undefined) ?? null,
      lastSaleAt: statistics.lastSaleAt ?? null,
      totalEarnings: readNumber(statistics.totalEarnings),
      totalTransactions: readNumber(statistics.totalTransactions),
      unitsSoldTotal: readNumber(statistics.unitsSoldTotal),
    },
    menuItems,
    stockItems,
    dailySummaries,
    stockActivity,
  };
}
