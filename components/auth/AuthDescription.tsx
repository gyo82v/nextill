import type { AuthDescriptionProps } from "@/types";

export default function AuthDescription({
  title,
  description,
  benefit,
  freeNote,
  cta,
  featuresTitle,
  features = [],
}: AuthDescriptionProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-default bg-surface-2 px-3 py-1 text-xs font-medium text-muted">
          <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
          Nextill
        </div>

        <div className="space-y-4">
          <h1 id="auth-page-title" className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
            {description}
          </p>

          <p className="max-w-xl text-sm font-medium leading-6 text-[var(--foreground)] sm:text-base">
            {benefit}
          </p>

          <p className="text-sm leading-6 text-muted">
            {freeNote}
          </p>
        </div>

        <div className="space-y-3 pt-2 hidden md:block">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {featuresTitle}
          </h2>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="rounded-2xl border border-default bg-surface-2 px-4 py-3 text-sm leading-6 text-[var(--foreground)] shadow-sm"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-default bg-surface-2 px-4 py-4 shadow-sm">
        <p className="text-sm font-medium text-primary">{cta}</p>
      </div>
    </div>
  );
}
