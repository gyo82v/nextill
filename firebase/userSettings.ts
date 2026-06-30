import { doc, updateDoc, runTransaction } from "firebase/firestore";
import { db } from "./firebase";
import type { DarkmodeProps, LanguageProps, CurrencyProps } from "@/types";

export async function updateDarkMode({uid, darkmode}: DarkmodeProps) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.settings.darkmode": darkmode,
  });
}

export async function updateLanguage({uid, nextLang}: LanguageProps) {
    const ref = doc(db, "users", uid);

    await updateDoc(ref, {
        "nextillApp.settings.language": nextLang,
    });
}

export async function updateCurrency({uid, currency}: CurrencyProps) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.settings.currency": currency,
  });
}

export async function updateBalanceOption({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.balanceEnabled") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.balanceEnabled": !current,
    });
  });
}

export async function updateTicketOption({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.ticketEnabled") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.ticketEnabled": !current,
    });
  });
}

export async function updateReceiptOption({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.receiptEnabled") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.receiptEnabled": !current,
    });
  });
}

export async function updateDisableMotion({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.disableMotion") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.disableMotion": !current,
    });
  });
}

export async function updateSoundOption({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.soundEnabled") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.soundEnabled": !current,
    });
  });
}

export async function updateDiscountOption({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.discountEnabled") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.discountEnabled": !current,
    });
  });
}

export async function updatePaymentOption({ uid }: { uid: string }) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("User document does not exist");
    }

    const current =
      snap.get("nextillApp.settings.paymentMethodSelectionEnabled") ?? false;

    transaction.update(ref, {
      "nextillApp.settings.paymentMethodSelectionEnabled": !current,
    });
  });
}

