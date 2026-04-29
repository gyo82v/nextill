import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { focusRing, transitions } from "@/styles";
import { useTranslation } from "react-i18next";
import { FooterDivider } from "@/components/ui/dividers/Dividers";


export default function PublicFooter() {
  const { t } = useTranslation();
  return (
    <footer className={`border-t-2 border-[color:var(--border)] bg-[var(--background)]
                        md:py-6 lg:py-7 xl:py-8
                        px-4 py-4 text-[0.875rem] text-[var(--foreground)] sm:px-6 lg:px-8`}>
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row md:items-stretch">
        <div className="flex flex-1 items-center justify-center py-3 md:justify-start md:px-4 md:py-0">
          <Link
            href="/privacy-policy"
            className={`inline-flex items-center rounded-md px-2 py-1 font-medium
                        text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--primary-hover)]
                        hover:underline hover:underline-offset-4
                        ${transitions} ${focusRing}`}
          >
            {t("footer.privacy")}
          </Link>
        </div>

        <FooterDivider />

        <div className="flex flex-1 items-center justify-center py-4 text-center md:px-4 md:py-0">
          <div className="flex flex-col items-center gap-1.5 text-[var(--muted)]">
            <FiMail
              className="h-5 w-5 text-[var(--primary)]"
              aria-hidden="true"
            />
            <span className="leading-snug">{t("footer.mailText")}</span>
            <a
              href="mailto:gyo82v@gmail.com"
              className={`font-medium text-[var(--foreground)] underline underline-offset-4
                          hover:text-[var(--primary-hover)] ${transitions} ${focusRing}`}
            >
              gyo82v@gmail.com
            </a>
          </div>
        </div>

        <FooterDivider />

        <div className={`flex flex-1 items-center justify-center py-3 text-center
                         md:justify-end md:px-4 md:py-0 md:text-right`}>
          <span className="text-[var(--muted)]">
            © 2026 Nextill
          </span>
        </div>
      </div>
    </footer>
  );
}



