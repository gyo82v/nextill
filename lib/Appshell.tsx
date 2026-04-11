"use client";

import { useAuth } from "@/firebase/authProvider";
import { useLanguageSync } from "@/hooks/useLanguageSync";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();

  useLanguageSync(profile);

  return <>{children}</>;
}