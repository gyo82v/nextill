import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { DarkmodeProps, LanguageProps } from "@/types";

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