import type { AuthPageLayoutProps } from "@/types";

export default function AuthLayout({ description, form, className = "" }: AuthPageLayoutProps) {
  return (
    <section
      className={`w-full px-4 py-12 sm:px-6 lg:px-8  xl:py-16 ${className}`}
      aria-labelledby="auth-page-title"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
        <div className="grid w-full items-stretch gap-10 lg:grid-cols-2 lg:gap-8">
          {/* Description */}
          <div className="relative overflow-hidden rounded-3xl border border-default bg-surface-1 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
            <div className="relative">
              {description}
            </div>
          </div>

          {/* Form */}
          <div className="relative overflow-hidden rounded-3xl border border-default bg-surface-1 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
            <div className="relative">
              {form}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
