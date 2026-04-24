"use client";

import { useAuth } from "@/firebase/authProvider";
import { transitions, activePress, focusRing } from "@/styles";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

export default function UserSection() {
  const { profile, signOut, loading } = useAuth();
  const router = useRouter();

  const displayName = profile?.displayName?.trim() || "User";

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <section
      aria-labelledby="user-section-heading"
      className={`inline-flex items-center gap-3 rounded-2xl
                  border border-default bg-surface-1 px-3 py-2 shadow-sm`}
    >
      <h2 id="user-section-heading" className="sr-only">
        User account
      </h2>

      <div className="min-w-0 leading-tight">
        <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Signed in as
        </span>
        <span className={`block max-w-[10rem] truncate text-sm font-semibold
                          tracking-tight text-foreground sm:max-w-none`}>
          {displayName}
        </span>
      </div>

      <span
        aria-hidden="true"
        className="h-6 border-l border-default self-center"
      />

      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        aria-label="Sign out"
        className={`group inline-flex h-11 items-center gap-2 rounded-2xl
                    border border-default bg-surface-2 px-3.5
                    text-sm font-medium text-muted shadow-sm
                    ${transitions} ${activePress} ${focusRing}
                    hover:-translate-y-0.5 hover:shadow-md hover:bg-surface-1
                    dark:hover:shadow-black/20`}
      >
        <FiLogOut
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform duration-200
                      ease-out group-hover:-translate-x-0.5`}
        />
        <span>Sign out</span>
      </button>
    </section>
  );
}
