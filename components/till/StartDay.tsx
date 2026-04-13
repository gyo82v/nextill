"use client";

import { useState } from "react";
import { startDay } from "@/firebase/dayCycle";
import { useAuth } from "@/firebase/authProvider";

export default function StartDay() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleStart() {
    const value = Number(amount);
    if (isNaN(value) || !user) return;

    setLoading(true);
    await startDay({uid: user.uid, openingBalance: value});
    setLoading(false);
  }

  return (
    <div className="space-y-4 max-w-sm">
      <h2 className="text-xl font-semibold">Start day</h2>

      <input
        type="number"
        placeholder="Opening balance"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      <button
        onClick={handleStart}
        disabled={loading}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        Start day
      </button>
    </div>
  );
}