"use client";

import { useAuth } from "@/firebase/authProvider";
import StartDay from "@/components/till/StartDay";
import EndDay from "@/components/till/EndDay";
import { Timestamp } from "firebase/firestore";

export default function TillPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading till...</div>;
  }

  const dayCycle = profile?.nextillApp?.dayCycle;
  const active = dayCycle?.active ?? false;

  const startedAt =
    dayCycle?.startedAt instanceof Timestamp
      ? dayCycle.startedAt.toDate().toLocaleTimeString()
      : null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-red-500 font-semibold">Till</h1>

      {!active ? (
        <StartDay />
      ) : (
        <>
          {startedAt && (
            <p className="text-sm text-muted-foreground">
              Day started at: {startedAt}
            </p>
          )}

          {/* Till UI will go here */}

          <EndDay />
        </>
      )}
    </div>
  );
}