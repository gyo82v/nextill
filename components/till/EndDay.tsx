"use client";

import { useState } from "react";
import { endDay } from "@/firebase/dayCycle";
import { useAuth } from "@/firebase/authProvider";

export default function EndDay() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleEnd() {
    const value = Number(amount);
    if (isNaN(value) || !user) return;

    setLoading(true);
    await endDay(user.uid, value);
    setLoading(false);
  }

  return (
    <div className="space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">End day</h2>

      <input
        type="number"
        placeholder="Closing balance"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      <button
        onClick={handleEnd}
        disabled={loading}
        className="rounded border px-4 py-2 disabled:opacity-50"
      >
        End day
      </button>
    </div>
  );
}