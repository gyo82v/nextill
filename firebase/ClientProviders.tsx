"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./authProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

type Props = {
  children: React.ReactNode;
};

export default function ClientProviders({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nextProvider i18n={i18n}>
        <AuthProvider>{children}</AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}