import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebase";
import type {
  RawDailySummaryForExport,
  RawMenuItemForExport,
  RawStockActivityForExport,
  RawStockItemForExport,
} from "./buildAccountExportReport";

export type ExportUserDataResult = {
  user: {
    email?: string | null;
    username?: string | null;
    createdAt?: unknown;
    emailConfirmed?: boolean | null;
  };
  settings: {
    dayActive?: boolean | null;
    dayDate?: string | null;
    language?: string | null;
    currency?: string | null;
    darkMode?: boolean | null;
    balanceEnabled?: boolean | null;
    ticketEnabled?: boolean | null;
    receiptEnabled?: boolean | null;
    disableMotion?: boolean | null;
  };
  dayCycle: {
    startedAt?: unknown | null;
    endedAt?: unknown | null;
    openingBalance?: number | null;
    closingBalance?: number | null;
    dayKey?: string | null;
    nextTicketNumber?: number | null;
  };
  statistics: {
    itemsSales?: Record<string, number> | null;
    lastSaleAt?: unknown;
    totalEarnings?: number | null;
    totalTransactions?: number | null;
    unitsSoldTotal?: number | null;
  };
  menuItems: RawMenuItemForExport[];
  stockItems: RawStockItemForExport[];
  dailySummaries: RawDailySummaryForExport[];
  stockActivity: RawStockActivityForExport[];
};

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

/**
 * Fetches the raw data needed to build an export report.
 *
 * Assumptions used here:
 * - user profile lives in `users/{uid}`
 * - menu items live in a top-level `menuItems` collection and contain `uid`
 * - stock items live in a top-level `stock` collection and contain `uid`
 * - daily summaries live in `users/{uid}/dailySummaries`
 * - stock activity lives in `users/{uid}/stockActivity`
 *
 * If your schema differs, adjust the collection names and field names here only.
 */
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



/*

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



*/