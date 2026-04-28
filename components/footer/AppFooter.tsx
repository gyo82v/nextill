import { FiMail } from "react-icons/fi";
import { focusRing, transitions } from "@/styles"

export default function AppFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[var(--background)] px-4 py-5 text-[0.875rem] text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="flex flex-col items-center gap-1 text-[var(--muted)] sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
            <span className="inline-flex items-center gap-2">
              <FiMail
                className="mt-0.5 shrink-0 text-[var(--primary)]"
                aria-hidden="true"
              />
              <span>Have feedback or suggestions? Contact us at</span>
            </span>
            <a
              href={`mailto:gyo82v@gmail.com`}
              className={[
                "font-medium text-[var(--foreground)] underline underline-offset-4",
                "hover:text-[var(--primary)]",
                transitions,
                focusRing,
              ].join(" ")}
            >
              gyo82v@gmail.com
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
          <span className="text-[var(--muted)]">Built with Next.js</span>
          <span className="text-[var(--muted)]">©Copyright 2026 Nextill</span>
        </div>
      </div>
    </footer>
  );
}