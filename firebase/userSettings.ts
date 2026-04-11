import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function updateDarkMode(
  uid: string,
  darkmode: boolean
) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    "nextillApp.settings.darkmode": darkmode,
  });
}

export async function updateLanguage(uid:string, nextLang:string){
    const ref = doc(db, "users", uid);

    await updateDoc(ref, {
        "nextillApp.settings.language": nextLang,
    });
}