"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "./authProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import MotionProvider from "@/providers/MotionProvider";

/* 🔹 Small internal wrapper so we can access auth state */
function MotionGate({ children }: { children: ReactNode }) {
  const { profile } = useAuth();

  return (
    <>
      <MotionProvider reduceMotion={profile?.nextillApp?.settings?.disableMotion ?? null} />
      {children}
    </>
  );
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <MotionGate>
            {children}
          </MotionGate>
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}