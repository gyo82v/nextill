"use client"

import Link from "next/link";
import { buttonPrimaryStyle } from "@/styles";
import { useTranslation } from "react-i18next";


export default function GlobalNotFound() {
    const {t} = useTranslation()
  return (
    <section className="min-h-[60vh] mx-auto flex flex-col items-center mt-0 md:mt-30 gap-6 p-6 text-center">
      <h1 className="text-2xl font-bold text-orange-800">
        {t("notFound.title")}
      </h1>

      <p className="max-w-md text-sm text-orange-700/80">
        {t("notFound.description")}
      </p>

      <Link
        href="/"
        className={`${buttonPrimaryStyle}`}
      >
        {t("notFound.link")}
      </Link>
    </section>
  );
}