// components/ClientProviders.tsx
"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./authProvider";

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
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}